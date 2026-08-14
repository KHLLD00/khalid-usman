import type { ContentBlock, GalleryImage, Project } from "@/lib/cms";

// All image handling lives in one place; re-exported for existing call sites.
export {
  BUCKET,
  deleteImage,
  isStoragePath,
  listImages,
  uploadImage,
  validateImageFile,
  type MediaFolder,
} from "@/lib/media";

type SupabaseLikeError = { message?: string; code?: string } | Error | unknown;

/** Turns a raw Supabase/Postgres error into a short, actionable message for the studio UI. */
export function describeSupabaseError(error: SupabaseLikeError): string {
  const code = (error as { code?: string } | null)?.code;
  const message =
    error instanceof Error
      ? error.message
      : ((error as { message?: string } | null)?.message ?? "Something went wrong.");

  if (code === "23505" || /duplicate key value/i.test(message)) {
    return "That slug is already used by another project — choose a different one.";
  }
  if (code === "42501" || /permission denied|row-level security/i.test(message)) {
    return "You don't have permission to do that. Try signing in again.";
  }
  if (/failed to fetch|network/i.test(message)) {
    return "Couldn't reach the server. Check your connection and try again.";
  }
  return message;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const EMPTY_IMAGE: GalleryImage = { url: "", alt: "", caption: "", aspect: "auto" };

export const BLOCK_TYPES: { type: ContentBlock["type"]; label: string }[] = [
  { type: "heading", label: "Section heading" },
  { type: "rich-text", label: "Rich text" },
  { type: "image", label: "Large image" },
  { type: "gallery", label: "Image gallery" },
  { type: "compare", label: "Side by side" },
  { type: "text-image", label: "Text + image" },
  { type: "quote", label: "Quote" },
  { type: "video", label: "Video" },
  { type: "metrics", label: "Metrics" },
  { type: "timeline", label: "Process timeline" },
];

export function makeBlock(type: ContentBlock["type"]): ContentBlock {
  switch (type) {
    case "heading":
      return { type, text: "" };
    case "rich-text":
      return { type, text: "" };
    case "quote":
      return { type, text: "", attribution: "" };
    case "image":
      return { type, image: { ...EMPTY_IMAGE }, width: "wide" };
    case "gallery":
      return { type, images: [{ ...EMPTY_IMAGE }], columns: 2 };
    case "compare":
      return { type, images: [{ ...EMPTY_IMAGE }, { ...EMPTY_IMAGE }] };
    case "text-image":
      return { type, heading: "", text: "", image: { ...EMPTY_IMAGE } };
    case "video":
      return { type, url: "", caption: "" };
    case "metrics":
      return { type, items: [{ label: "", value: "" }] };
    case "timeline":
      return { type, items: [{ label: "", description: "" }] };
  }
}

export type ProjectDraft = Omit<Project, "id"> & { id?: string };

export function emptyProject(): ProjectDraft {
  return {
    title: "",
    slug: "",
    short_description: "",
    category: "",
    year: String(new Date().getFullYear()),
    role: "",
    cover_image_url: null,
    cover_image_alt: "",
    thumbnail_url: null,
    hero_image_url: null,
    hero_image_alt: "",
    overview: "",
    problem: "",
    research: "",
    insights: "",
    design_process: "",
    design_decisions: "",
    final_solution: "",
    results: "",
    reflection: "",
    tools: [],
    external_links: [],
    gallery: [],
    content_blocks: [],
    featured: true,
    published: false,
    sort_order: 0,
  };
}
