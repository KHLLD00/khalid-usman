import type { ToolkitItem } from "@/lib/cms";

/**
 * Content, ordering, and visibility come from Studio (toolkit_items table).
 * Animation, speed, typography, and spacing are fixed here in code — see
 * .ticker-track in styles.css. Respects prefers-reduced-motion (animation
 * disabled via media query) and pauses on hover.
 */
export function ToolkitTicker({ items }: { items: ToolkitItem[] }) {
  if (!items.length) return null;

  return (
    <div className="overflow-hidden border-y py-6" role="list" aria-label="Design toolkit">
      <div className="ticker-track">
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1} className="flex shrink-0">
            {items.map((item) => (
              <span
                key={`${copy}-${item.id}`}
                role="listitem"
                className="type-h3 flex items-center gap-8 px-8 text-muted-foreground"
              >
                {item.name}
                <span aria-hidden className="text-border">
                  ·
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
