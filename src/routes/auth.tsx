import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Studio sign in — Khalid Usman" },
      { name: "description", content: "Sign in to manage portfolio content." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Studio sign in — Khalid Usman" },
      { property: "og:description", content: "Sign in to manage portfolio content." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/studio" });
    });
  }, [navigate]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/studio` },
      });
      setBusy(false);
      setStatus(error ? error.message : "Account created. You can sign in now.");
      if (!error) setMode("signin");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      setStatus(error.message);
      return;
    }
    navigate({ to: "/studio" });
  }

  return (
    <main className="shell flex min-h-screen max-w-lg flex-col justify-center py-24">
      <p className="type-label text-muted-foreground">Khalid Usman — Studio</p>
      <h1 className="type-h1 mt-6">{mode === "signin" ? "Sign in" : "Create account"}</h1>

      <form onSubmit={onSubmit} className="mt-10 space-y-6">
        <div>
          <label htmlFor="email" className="type-label text-muted-foreground">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full border-b bg-transparent py-3 text-base outline-none"
          />
        </div>
        <div>
          <label htmlFor="password" className="type-label text-muted-foreground">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full border-b bg-transparent py-3 text-base outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          className="type-meta w-full bg-primary py-4 text-primary-foreground transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          {busy ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      {status ? <p className="type-small mt-6 text-muted-foreground">{status}</p> : null}

      <button
        type="button"
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        className="type-meta link-underline mt-10 self-start text-muted-foreground"
      >
        {mode === "signin" ? "Need an account?" : "Already have an account?"}
      </button>
    </main>
  );
}
