import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { TextArea, TextInput } from "@/components/studio/Fields";
import { supabase } from "@/integrations/supabase/client";
import { allProjectsQuery, settingsQuery, type SiteSettings } from "@/lib/cms";
import { useState } from "react";

export const Route = createFileRoute("/studio/")({
  component: StudioHome,
});

function SettingsPanel({ settings }: { settings: SiteSettings }) {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<SiteSettings>(settings);
  const [saved, setSaved] = useState(false);

  const save = useMutation({
    mutationFn: async () => {
      const rows = Object.entries(draft).map(([key, value]) => ({ key, value }));
      const { error } = await supabase.from("site_settings").upsert(rows);
      if (error) throw error;
    },
    onSuccess: async () => {
      setSaved(true);
      await queryClient.invalidateQueries({ queryKey: settingsQuery.queryKey });
    },
  });

  function set(key: string, value: string) {
    setSaved(false);
    setDraft((current) => ({ ...current, [key]: value }));
  }

  return (
    <section className="mt-20 border-t pt-10">
      <h2 className="type-h3">Site content</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <TextArea
          label="About paragraph"
          rows={6}
          value={draft["about_paragraph"] ?? ""}
          onChange={(value) => set("about_paragraph", value)}
        />
        <div className="space-y-6">
          <TextInput
            label="Email"
            value={draft["email"] ?? ""}
            onChange={(value) => set("email", value)}
          />
          <TextInput
            label="LinkedIn URL"
            value={draft["linkedin_url"] ?? ""}
            onChange={(value) => set("linkedin_url", value)}
          />
          <TextInput
            label="Behance URL"
            value={draft["behance_url"] ?? ""}
            onChange={(value) => set("behance_url", value)}
          />
          <TextInput
            label="Resume URL"
            value={draft["resume_url"] ?? ""}
            onChange={(value) => set("resume_url", value)}
            hint="Leave empty to hide the resume link."
          />
        </div>
      </div>
      <div className="mt-8 flex items-center gap-6">
        <button
          type="button"
          onClick={() => save.mutate()}
          disabled={save.isPending}
          className="type-meta bg-primary px-6 py-3 text-primary-foreground transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          {save.isPending ? "Saving…" : "Save site content"}
        </button>
        {saved ? <span className="type-meta text-muted-foreground">Saved</span> : null}
        {save.error ? (
          <span className="type-meta">{(save.error as Error).message}</span>
        ) : null}
      </div>
    </section>
  );
}

function StudioHome() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const projects = useQuery(allProjectsQuery);
  const settings = useQuery(settingsQuery);

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });

  return (
    <main className="shell py-16">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="type-h2">Projects</h1>
        <button
          type="button"
          onClick={() => navigate({ to: "/studio/$id", params: { id: "new" } })}
          className="type-meta bg-primary px-6 py-3 text-primary-foreground transition-opacity hover:opacity-85"
        >
          New project
        </button>
      </div>

      <div className="mt-10 border-t">
        {projects.isLoading ? (
          <p className="type-meta py-6 text-muted-foreground">Loading…</p>
        ) : null}
        {projects.data?.length === 0 ? (
          <p className="type-meta py-6 text-muted-foreground">
            No projects yet. Create the first one.
          </p>
        ) : null}
        {projects.data?.map((project) => (
          <div
            key={project.id}
            className="flex flex-wrap items-center justify-between gap-4 border-b py-5"
          >
            <div>
              <Link
                to="/studio/$id"
                params={{ id: project.id }}
                className="type-h3 link-underline"
              >
                {project.title || "Untitled"}
              </Link>
              <p className="type-meta mt-1 text-muted-foreground">
                /work/{project.slug} · order {project.sort_order} ·{" "}
                {project.published ? "Published" : "Draft"}
                {project.featured ? " · Featured" : ""}
              </p>
            </div>
            <div className="flex items-center gap-6">
              <Link
                to="/work/$slug"
                params={{ slug: project.slug }}
                className="type-meta link-underline text-muted-foreground"
              >
                Preview
              </Link>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete “${project.title}”? This cannot be undone.`)) {
                    remove.mutate(project.id);
                  }
                }}
                className="type-meta link-underline text-muted-foreground"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {settings.data ? <SettingsPanel settings={settings.data} /> : null}
    </main>
  );
}
