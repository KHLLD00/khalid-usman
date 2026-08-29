import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  delay?: number;
  /** Skip the hide-then-fade behaviour entirely — for above-the-fold content
   * that's visible on arrival and has nothing to be "revealed" from. */
  immediate?: boolean;
};

/** Gentle scroll-in reveal. Honours prefers-reduced-motion via CSS. */
export function Reveal({
  children,
  className,
  as: Tag = "div",
  delay = 0,
  immediate = false,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(immediate);

  useEffect(() => {
    if (immediate) return;
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    observer.observe(node);
    // Safety net: guarantee real content is never left invisible indefinitely
    // if hydration is slow or the observer never fires for some reason.
    const timeout = window.setTimeout(() => setShown(true), 400);
    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
    };
  }, [immediate]);

  return (
    <Tag
      ref={ref}
      className={cn(!immediate && "reveal", !immediate && shown && "reveal-in", className)}
      style={delay && !immediate ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
