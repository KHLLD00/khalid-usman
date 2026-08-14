# Centralised image upload system for Studio

## What I found (inspection results)

Contrary to the note in your request, the backend from the earlier migrations **is** in place in this project:

- Tables that exist: `projects`, `experiments`, `nav_items`, `toolkit_items`, `site_settings`, `user_roles`.
- Auth/roles: `app_role` enum with `admin`, `user_roles` table, `has_role()` security-definer function, and a trigger that makes the first signed-up account the admin. All working.
- Storage: one private bucket `project-images` already exists, with four policies on it (read/upload/update/delete) all restricted to authenticated users who pass `has_role(admin)`. No service-role key is exposed to the frontend.
- Public reads: images are served through the server route `/api/public/image/$`, which streams the file from the private bucket with long cache headers. I tested it against real uploaded files — both returned 200 with correct content types, and the homepage hero image currently loads from it successfully.
- Studio image fields today: `ImagePicker` (single image) and `GalleryEditor` (multi image) in `src/components/studio/Fields.tsx`. Both already call `uploadImage()` in `src/lib/studio.ts`, which uploads to `project-images` and stores the storage path in the record. They are wired into: site hero image, project cover, project case-study hero, project gallery, image/gallery/compare/text-image content blocks, and experiment images.
- Four objects already exist in the bucket, so uploads themselves are reaching Storage.

**So the architecture is right, but the implementation is thin.** The real defects are in the upload component, not the database or the bucket.

## Actual problems to fix

1. `ImagePicker` gives almost no feedback: the file input stays enabled during upload, "Uploading…" is a bare text node, and there is no progress or disabled state — an upload of a multi-MB file looks like nothing happened, which reads as "upload is broken".
2. No validation. Non-image files, huge files (the existing objects are 0.9–1.3 MB, nothing stops a 40 MB drop), and unknown extensions are all accepted and fail late with a raw Storage error.
3. Errors are shown raw instead of via the existing `describeSupabaseError()` helper, so a permissions or network failure surfaces as unfriendly text.
4. Selecting the same file twice in a row does nothing, because the file input's value is never reset.
5. "Remove" only clears the reference — nothing ever deletes the object from Storage, so the bucket accumulates orphans.
6. No re-use: every field forces a fresh upload; there is no way to pick an image that was already uploaded.
7. `thumbnail_url` on `projects` is used by the frontend (`ProjectList`, `FeaturedReorder`, case-study cards fall back to it) but has **no field in Studio** — it can only ever be null.
8. Uploads land in the bucket root with random UUID names, so the bucket is unbrowsable and images can't be grouped by project.
9. The public image route accepts any path in the bucket and doesn't handle `HEAD` or conditional requests.

## Plan

### 1. One centralised upload module (`src/lib/media.ts`)
A single place all image handling goes through:
- `validateImageFile(file)` — allow-list of `jpg/jpeg/png/webp/avif/gif/svg`, max 10 MB, friendly messages.
- `uploadImage(file, { folder })` — validates, derives a safe extension, uploads to `folder/uuid.ext` (folders: `hero/`, `projects/`, `experiments/`, `blocks/`), returns the storage path.
- `deleteImage(path)` — removes the object, ignoring "not found".
- `listImages()` — lists bucket objects for the reuse picker.
- `imageSrc(path)` stays where it is in `cms.ts` (frontend display contract unchanged); `src/lib/studio.ts` re-exports from `media.ts` so nothing else breaks.

### 2. Rebuild `ImagePicker` (same visual language, no design change)
- Current image preview, `Uploading…` state with the input disabled and the whole control dimmed.
- Buttons: **Upload**, **Replace**, **Choose existing**, **Remove**.
- Remove deletes the Storage object when the path is one we own, then clears the reference.
- Errors via `describeSupabaseError`, dismissible, with the file input reset after every attempt.
- Optional `altValue` / `onAltChange` props so alt text sits directly under the image it describes.
- Drag-and-drop onto the preview area (plain border feedback, no new visual styling).

### 3. "Choose existing" media picker
A small modal listing what is already in the bucket (thumbnails via the existing public image route), so one upload can be reused across hero/cover/thumbnail. Monochrome, matching the current Studio chrome.

### 4. Cover the missing fields
- Add a **Thumbnail image** picker (+ reuses cover alt) to the project editor so `thumbnail_url` is actually manageable.
- Pass folder hints and alt-text wiring through `GalleryEditor` and the content-block editors so every image field in Studio behaves identically.

### 5. Backend changes (small)
No new tables. The bucket and its admin-only policies are already correct, so:
- Add an `anon`-readable path only if you want direct public URLs — I recommend **keeping the bucket private** and continuing to serve through `/api/public/image/$`, which already gives public read for the published site without exposing any key.
- Harden that route: reject paths outside the bucket's folder allow-list, support `HEAD`, and return `304` for conditional requests.

No visual/design changes to the public portfolio.
