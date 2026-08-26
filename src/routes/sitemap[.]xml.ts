import { createFileRoute } from "@tanstack/react-router";

const SITE_URL = "https://khalid-usman.vercel.app";

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function urlEntry(loc: string, lastmod?: string, priority = "0.7") {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}
    <priority>${priority}</priority>
  </url>`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: projects } = await supabaseAdmin
          .from("projects")
          .select("slug, updated_at")
          .eq("published", true);

        const entries = [urlEntry(SITE_URL, undefined, "1.0")];

        for (const project of projects ?? []) {
          const lastmod = project.updated_at
            ? new Date(project.updated_at as string).toISOString().slice(0, 10)
            : undefined;
          entries.push(urlEntry(`${SITE_URL}/work/${project.slug}`, lastmod, "0.8"));
        }

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>`;

        return new Response(xml, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
