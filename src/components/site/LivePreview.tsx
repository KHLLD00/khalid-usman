import { useEffect, useRef, useState } from "react";

import { imageSrc, type Project } from "@/lib/cms";
import { cn } from "@/lib/utils";

/** How long we wait for the iframe to report it loaded before giving up on it. */
const LOAD_TIMEOUT_MS = 6000;

/**
 * Live preview for a Published Website project. Loads the iframe only once
 * the card nears the viewport, and falls back to the CMS preview image if
 * the iframe never loads (site down, blocks embedding, etc.). Detecting an
 * embedding refusal (X-Frame-Options / frame-ancestors) isn't reliably
 * observable from JS, so this is a best-effort timeout rather than a
 * guaranteed detection — enable the live preview only for sites confirmed
 * to embed cleanly.
 */
export function LivePreview({ project, className }: { project: Project; className?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [nearViewport, setNearViewport] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const fallbackSrc = imageSrc(project.preview_image_url ?? project.cover_image_url);
  const canEmbed = project.live_preview_enabled && Boolean(project.live_website_url);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setNearViewport(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setNearViewport(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!nearViewport || !canEmbed || loaded) return;
    const timer = window.setTimeout(() => setFailed(true), LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [nearViewport, canEmbed, loaded]);

  const showIframe = canEmbed && nearViewport && !failed;
  const showFallback = !showIframe || !loaded;

  return (
    <div
      ref={containerRef}
      className={cn("relative aspect-[16/11] overflow-hidden bg-secondary", className)}
    >
      {fallbackSrc ? (
        <img
          src={fallbackSrc}
          alt={`${project.title} preview`}
          loading="lazy"
          decoding="async"
          className={cn(
            "absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500",
            showFallback ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        />
      ) : null}

      {showIframe ? (
        <iframe
          src={project.live_website_url}
          title={`${project.title} live preview`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={cn(
            "absolute inset-0 h-full w-full border-0 transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      ) : null}

      {project.live_status ? (
        <span
          className={cn(
            "type-meta absolute top-4 left-4 inline-flex items-center gap-1.5 bg-background/90 px-2.5 py-1 backdrop-blur-sm",
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              project.live_status === "live" ? "bg-emerald-500" : "bg-muted-foreground",
            )}
          />
          {project.live_status === "live" ? "Live" : "Offline"}
        </span>
      ) : null}
    </div>
  );
}
