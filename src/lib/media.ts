import { supabase } from "@/integrations/supabase/client";

/** Private bucket holding every Studio-managed portfolio image. */
export const BUCKET = "project-images";

/** Folders images are grouped into inside the bucket. */
export type MediaFolder = "hero" | "projects" | "experiments" | "blocks";

export const MEDIA_FOLDERS: MediaFolder[] = ["hero", "projects", "experiments", "blocks"];

const ALLOWED_EXT = ["jpg", "jpeg", "png", "webp", "avif", "gif", "svg"] as const;
const MAX_BYTES = 10 * 1024 * 1024;

function extensionOf(file: File): string {
  const fromName = file.name.split(".").pop()?.toLowerCase() ?? "";
  if ((ALLOWED_EXT as readonly string[]).includes(fromName)) return fromName;
  const fromType = file.type.split("/").pop()?.toLowerCase() ?? "";
  if (fromType === "svg+xml") return "svg";
  if ((ALLOWED_EXT as readonly string[]).includes(fromType)) return fromType;
  return "";
}

/** Returns a friendly message when the file can't be uploaded, or null when it's fine. */
export function validateImageFile(file: File): string | null {
  if (file.size === 0) return "That file is empty.";
  if (file.size > MAX_BYTES) {
    return `That image is ${(file.size / 1024 / 1024).toFixed(1)} MB — the limit is 10 MB. Export a smaller version and try again.`;
  }
  if (file.type && !file.type.startsWith("image/")) {
    return "That file isn't an image. Use JPG, PNG, WebP, AVIF, GIF or SVG.";
  }
  if (!extensionOf(file)) {
    return "Unsupported image format. Use JPG, PNG, WebP, AVIF, GIF or SVG.";
  }
  return null;
}

/** Uploads an image into the private bucket and returns its storage path. */
export async function uploadImage(
  file: File,
  options: { folder?: MediaFolder } = {},
): Promise<string> {
  const invalid = validateImageFile(file);
  if (invalid) throw new Error(invalid);

  const folder = options.folder ?? "blocks";
  const path = `${folder}/${crypto.randomUUID()}.${extensionOf(file)}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;
  return path;
}

/** True when the value is a storage path we own (not an external absolute URL). */
export function isStoragePath(value?: string | null): boolean {
  if (!value) return false;
  return !/^(https?:)?\/\//.test(value) && !value.startsWith("/");
}

/** Deletes an uploaded object; external URLs and missing objects are ignored. */
export async function deleteImage(path?: string | null): Promise<void> {
  if (!isStoragePath(path)) return;
  const { error } = await supabase.storage.from(BUCKET).remove([path as string]);
  if (error && !/not found/i.test(error.message)) throw error;
}

export type MediaObject = { path: string; name: string; updatedAt: string | null };

/** Lists everything already uploaded, newest first, for the reuse picker. */
export async function listImages(): Promise<MediaObject[]> {
  const results = await Promise.all(
    MEDIA_FOLDERS.map(async (folder) => {
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .list(folder, { limit: 200, sortBy: { column: "created_at", order: "desc" } });
      if (error) throw error;
      return (data ?? [])
        .filter((entry) => entry.id)
        .map((entry) => ({
          path: `${folder}/${entry.name}`,
          name: entry.name,
          updatedAt: entry.updated_at ?? entry.created_at ?? null,
        }));
    }),
  );

  // Legacy uploads that predate folders live in the bucket root.
  const { data: root, error: rootError } = await supabase.storage
    .from(BUCKET)
    .list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });
  if (rootError) throw rootError;
  const legacy = (root ?? [])
    .filter((entry) => entry.id && entry.name.includes("."))
    .map((entry) => ({
      path: entry.name,
      name: entry.name,
      updatedAt: entry.updated_at ?? entry.created_at ?? null,
    }));

  return [...results.flat(), ...legacy].sort((a, b) =>
    (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""),
  );
}
