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

/** Storage paths resolve to public Supabase Storage URLs; absolute URLs pass through. */
export function imageSrc(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (/^(https?:)?\/\//.test(url) || url.startsWith("/")) return url;
  return supabase.storage.from("project-images").getPublicUrl(url).data.publicUrl;
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

export type NavItem = {
  id: string;
  label: string;
  url: string;
  sort_order: number;
  visible: boolean;
};

export type Experiment = {
  id: string;
  title: string;
  description: string;
  category: string;
  year: string;
  image_url: string | null;
  image_alt: string;
  external_url: string;
  sort_order: number;
  published: boolean;
};

export type ToolkitItem = {
  id: string;
  name: string;
  category: string | null;
  sort_order: number;
  visible: boolean;
};

export const navItemsQuery = queryOptions({
  queryKey: ["nav-items", "visible"],
  queryFn: async (): Promise<NavItem[]> => {
    const { data, error } = await supabase
      .from("nav_items")
      .select("*")
      .eq("visible", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as NavItem[];
  },
});

export const allNavItemsQuery = queryOptions({
  queryKey: ["nav-items", "all"],
  queryFn: async (): Promise<NavItem[]> => {
    const { data, error } = await supabase
      .from("nav_items")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as NavItem[];
  },
});

export const experimentsQuery = queryOptions({
  queryKey: ["experiments", "published"],
  queryFn: async (): Promise<Experiment[]> => {
    const { data, error } = await supabase
      .from("experiments")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as Experiment[];
  },
});

export const allExperimentsQuery = queryOptions({
  queryKey: ["experiments", "all"],
  queryFn: async (): Promise<Experiment[]> => {
    const { data, error } = await supabase
      .from("experiments")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as Experiment[];
  },
});

export const toolkitItemsQuery = queryOptions({
  queryKey: ["toolkit-items", "visible"],
  queryFn: async (): Promise<ToolkitItem[]> => {
    const { data, error } = await supabase
      .from("toolkit_items")
      .select("*")
      .eq("visible", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as ToolkitItem[];
  },
});

export const allToolkitItemsQuery = queryOptions({
  queryKey: ["toolkit-items", "all"],
  queryFn: async (): Promise<ToolkitItem[]> => {
    const { data, error } = await supabase
      .from("toolkit_items")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as ToolkitItem[];
  },
});

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
  email: "usmankhaleed899@gmail.com",
  linkedin_url: "https://www.linkedin.com/in/khalid-usman-6606723a0",
  behance_url: "https://www.behance.net/khalidusman12",
  x_url: "https://x.com/KAY_UIUX",
  instagram_url: "https://www.instagram.com/the.khaleed",
  resume_url: "",
  hero_eyebrow: "Product Design / UI/UX / Digital Experiences",
  hero_headline: "I design digital products with clarity and character.",
  hero_description:
    "Product designer focused on creating thoughtful digital experiences, interfaces and products.",
  hero_image_url: "",
  hero_image_alt: "",
  primary_cta_text: "View my work",
  primary_cta_url: "/#work",
  secondary_cta_text: "Let's talk",
  secondary_cta_url: "/#contact",
  about_heading:
    "I'm Khalid Usman, a product designer interested in making digital products clearer, more useful and more human.",
  contact_heading: "Let's make something worth using.",
  footer_headline: "Let's make something worth using.",
  footer_description: "",
};
