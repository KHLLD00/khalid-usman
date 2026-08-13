import { cn } from "@/lib/utils";

/** Renders plain-text CMS copy: blank lines become paragraphs, "- " lines become lists. */
export function RichText({ text, className }: { text?: string | null; className?: string }) {
  if (!text || !text.trim()) return null;

  const blocks = text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className={cn("type-body max-w-[68ch] space-y-6 text-foreground/85", className)}>
      {blocks.map((block, index) => {
        const lines = block.split("\n").map((line) => line.trim());
        if (lines.every((line) => line.startsWith("- "))) {
          return (
            <ul key={index} className="space-y-3">
              {lines.map((line, i) => (
                <li key={i} className="flex gap-4">
                  <span aria-hidden className="mt-[0.7em] h-px w-4 shrink-0 bg-border" />
                  <span>{line.slice(2)}</span>
                </li>
              ))}
            </ul>
          );
        }
        return <p key={index}>{block}</p>;
      })}
    </div>
  );
}
