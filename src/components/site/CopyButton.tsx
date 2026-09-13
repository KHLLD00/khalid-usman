import { useState } from "react";

import { cn } from "@/lib/utils";

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable or blocked — the email link itself still works.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "type-meta border px-3 py-1.5 whitespace-nowrap text-muted-foreground transition-colors duration-300 hover:text-foreground",
      )}
    >
      {copied ? "Copied" : label}
    </button>
  );
}
