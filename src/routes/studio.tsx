import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "Studio — Khalid Usman" },
      { name: "description", content: "Manage portfolio projects and site content." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Studio — Khalid Usman" },
      { property: "og:description", content: "Manage portfolio projects and site content." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: StudioLayout,
});

function StudioLayout() {
  const navigate = useNavigate();
  const [state, setState] = useState<"loading" | "ready" | "denied">("loading");

  useEffect(() => {
    let active = true;

    async function check() {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      if (!data.session) {
        navigate({ to: "/auth" });
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("role", "admin");
      if (!active) return;
      setState(roles && roles.length ? "ready" : "denied");
    }

    check();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate({ to: "/auth" });
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  if (state === "loading") {
    return <p className="shell type-meta py-24 text-muted-foreground">Loading studio…</p>;
  }

  if (state === "denied") {
    return (
      <main className="shell py-24">
        <h1 className="type-h2">No studio access</h1>
        <p className="type-body mt-4 text-muted-foreground">
          This account is signed in but is not an administrator.
        </p>
        <button
          type="button"
          onClick={() => supabase.auth.signOut()}
          className="type-meta link-underline mt-8"
        >
          Sign out
        </button>
      </main>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="rule-top border-b">
        <div className="shell flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/studio" className="text-sm font-medium">
              Studio
            </Link>
            <Link to="/" className="type-meta link-underline text-muted-foreground">
              View site
            </Link>
          </div>
          <button
            type="button"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/auth" });
            }}
            className="type-meta link-underline text-muted-foreground"
          >
            Sign out
          </button>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
