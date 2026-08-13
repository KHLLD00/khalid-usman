import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

export type GalleryImage = {
  url: string;
  alt?: string;
  caption?: string;
  aspect?: "auto" | "square" | "wide" | "tall";
};

export type ContentBlock =
  | { type: "heading"; text: string }
  | { type: "rich-text"; text: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "image"; image: GalleryImage; width?: "full" | "wide" | "text" }
  | { type: "gallery"; images: GalleryImage[]; columns?: 2 | 3 }
  | { type: "text-image"; text: string; heading?: string; image: GalleryImage }
  | { type: "compare"; images: GalleryImage[] }
  | { type: "video"; url: string; caption?: string }
  | { type: "metrics"; items: { label: string; value: string }[] }
  | { type: "timeline"; items: { label: string; description?: string }[] };

export type ExternalLink = { label: string; url: string };

export type Project = {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  category: string;
  year: string;
  role: string;
  cover_image_url: string | null;
  cover_image_alt: string;
  thumbnail_url: string | null;
  hero_image_url: string | null;
  hero_image_alt: string;
  overview: string;
  problem: string;
  research: string;
  insights: string;
  design_process: string;
  design_decisions: string;
  final_solution: string;
  results: string;
  reflection: string;
  tools: string[];
  external_links: ExternalLink[];
  gallery: GalleryImage[];
  content_blocks: ContentBlock[];
  featured: boolean;
  published: boolean;
  sort_order: number;
};

const PROJECT_COLUMNS = "*";

function normalise(row: Record<string, unknown>): Project {
  return {
    ...(row as unknown as Project),
    tools: Array.isArray(row["tools"]) ? (row["tools"] as string[]) : [],
    external_links: Array.isArray(row["external_links"])
      ? (row["external_links"] as ExternalLink[])
      : [],
    gallery: Array.isArray(row["gallery"]) ? (row["gallery"] as GalleryImage[]) : [],
    content_blocks: Array.isArray(row["content_blocks"])
      ? (row["content_blocks"] as ContentBlock[])
      : [],
  };
}

/** Storage paths are resolved through a public image route; absolute URLs pass through. */
export function imageSrc(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (/^(https?:)?\/\//.test(url) || url.startsWith("/")) return url;
  return `/api/public/image/${url.split("/").map(encodeURIComponent).join("/")}`;
}

export const projectsQuery = queryOptions({
  queryKey: ["projects", "published"],
  queryFn: async (): Promise<Project[]> => {
    const { data, error } = await supabase
      .from("projects")
      .select(PROJECT_COLUMNS)
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => normalise(row as Record<string, unknown>));
  },
});

export const allProjectsQuery = queryOptions({
  queryKey: ["projects", "all"],
  queryFn: async (): Promise<Project[]> => {
    const { data, error } = await supabase
      .from("projects")
      .select(PROJECT_COLUMNS)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => normalise(row as Record<string, unknown>));
  },
});

export function projectQuery(slug: string) {
  return queryOptions({
    queryKey: ["project", slug],
    queryFn: async (): Promise<Project | null> => {
      const { data, error } = await supabase
        .from("projects")
        .select(PROJECT_COLUMNS)
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data ? normalise(data as Record<string, unknown>) : null;
    },
  });
}

export type SiteSettings = Record<string, string>;

export const settingsQuery = queryOptions({
  queryKey: ["site-settings"],
  queryFn: async (): Promise<SiteSettings> => {
    const { data, error } = await supabase.from("site_settings").select("key, value");
    if (error) throw error;
    const out: SiteSettings = {};
    for (const row of data ?? []) out[row.key] = row.value ?? "";
    return out;
  },
});

export const SETTINGS_FALLBACK: SiteSettings = {
  about_paragraph: "",
  email: "hello@khalidusman.design",
  linkedin_url: "https://www.linkedin.com/",
  behance_url: "https://www.behance.net/",
  resume_url: "",
};
