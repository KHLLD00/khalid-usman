import { supabase } from "@/integrations/supabase/client";
import type { ContentBlock, GalleryImage, Project } from "@/lib/cms";

export const BUCKET = "project-images";

/** Uploads a file to the private portfolio bucket and returns its storage path. */
export async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type });
  if (error) throw error;
  return path;
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
