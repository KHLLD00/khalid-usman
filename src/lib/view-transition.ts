import { useEffect, useState } from "react";

/**
 * True when the browser supports the View Transitions API and the user has
 * not requested reduced motion. Used to gate TanStack Router's `viewTransition`
 * prop on project links, so the click morphs the cover image into the
 * case-study hero image instead of a plain navigation.
 *
 * Starts false (safe for SSR) and resolves client-side after mount.
 */
export function useViewTransitionEnabled(): boolean {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const supported =
      typeof document !== "undefined" &&
      typeof (document as { startViewTransition?: unknown }).startViewTransition === "function";
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(supported && !reducedMotion);
  }, []);

  return enabled;
}

/**
 * Shared naming convention so the homepage cover image and the matching
 * case-study hero image are recognised by the browser as the same element
 * across the navigation, which is what produces the morph/expand effect.
 */
export function projectViewTransitionName(id: string): string {
  return `project-image-${id}`;
}
