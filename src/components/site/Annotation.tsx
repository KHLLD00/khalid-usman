import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";

/**
 * Handwritten margin note. The text wipes in and the sketch arrow draws itself
 * once the note scrolls into view (see .note-* in styles.css). Renders nothing
 * when the CMS text is empty.
 */
export function Annotation({
  text,
  arrow = false,
  delay,
  className,
}: {
  text?: string | undefined;
  arrow?: boolean;
  delay?: number;
  className?: string;
}) {
  if (!text) return null;

  return (
    <Reveal delay={delay ?? 0} className={cn("flex items-end gap-2", className)}>
      <span className="note-text type-hand">{text}</span>
      {arrow ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 64 40"
          className="note-arrow h-8 w-12 shrink-0 text-cobalt"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 6C14 26 34 34 56 28" pathLength={1} />
          <path d="M46 20L57 28L47 36" pathLength={1} />
        </svg>
      ) : null}
    </Reveal>
  );
}
