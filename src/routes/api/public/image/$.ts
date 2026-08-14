import { createFileRoute } from "@tanstack/react-router";

/**
 * Public read-only image proxy for portfolio images stored in the private
 * "project-images" bucket. Only that bucket is reachable and only GET is served.
 */
const ALLOWED_PREFIXES = ["hero/", "projects/", "experiments/", "blocks/"];
const LEGACY_ROOT = /^[A-Za-z0-9._-]+\.[A-Za-z0-9]+$/;

function normalisePath(raw: string): string | null {
  const path = decodeURIComponent(raw).replace(/^\/+/, "");
  if (!path || path.includes("..") || path.includes("\\")) return null;
  const allowed =
    ALLOWED_PREFIXES.some((prefix) => path.startsWith(prefix)) || LEGACY_ROOT.test(path);
  return allowed ? path : null;
}

async function serve(raw: string, request: Request, includeBody: boolean) {
  const path = normalisePath(raw);
  if (!path) return new Response("Not found", { status: 404 });

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.storage.from("project-images").download(path);
  if (error || !data) return new Response("Not found", { status: 404 });

  const buffer = await data.arrayBuffer();
  const etag = `"${path}-${buffer.byteLength}"`;
  const headers: Record<string, string> = {
    "content-type": data.type || "application/octet-stream",
    "cache-control": "public, max-age=31536000, immutable",
    "content-length": String(buffer.byteLength),
    etag,
  };

  if (request.headers.get("if-none-match") === etag) {
    return new Response(null, { status: 304, headers });
  }

  return new Response(includeBody ? buffer : null, { headers });
}

export const Route = createFileRoute("/api/public/image/$")({
  server: {
    handlers: {
      GET: async ({ params, request }) =>
        serve((params as { _splat?: string })._splat ?? "", request, true),
      HEAD: async ({ params, request }) =>
        serve((params as { _splat?: string })._splat ?? "", request, false),
    },
  },
});
