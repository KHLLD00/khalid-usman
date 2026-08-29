/**
 * Global loading indicator. Wired up as the router's default pending
 * component (see router.tsx), so it appears automatically for any route or
 * loader that takes a moment — no per-page wiring needed. TanStack Router
 * only mounts this after its own short delay, so fast loads never flash it.
 */
export function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="loader-mark" aria-hidden="true">
        <span style={{ animationDelay: "0ms" }} />
        <span style={{ animationDelay: "120ms" }} />
        <span style={{ animationDelay: "240ms" }} />
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
