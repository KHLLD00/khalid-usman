import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { FeaturedReorder } from "@/components/studio/FeaturedReorder";
import { ImagePicker, TextArea, TextInput, Toggle } from "@/components/studio/Fields";
import { supabase } from "@/integrations/supabase/client";
import { allProjectsQuery, settingsQuery, SETTINGS_FALLBACK, type SiteSettings } from "@/lib/cms";
import { describeSupabaseError } from "@/lib/studio";
import { useState } from "react";

export const Route = createFileRoute("/studio/")({
  component: StudioHome,
});

function SettingsPanel({ settings }: { settings: SiteSettings }) {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<SiteSettings>({ ...SETTINGS_FALLBACK, ...settings });
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

  const text = (key: string, label: string, hint?: string) => (
    <TextInput
      label={label}
      value={draft[key] ?? ""}
      onChange={(value) => set(key, value)}
      {...(hint ? { hint } : {})}
    />
  );

  const area = (key: string, label: string, rows: number, hint?: string) => (
    <div className="md:col-span-2">
      <TextArea
        label={label}
        rows={rows}
        value={draft[key] ?? ""}
        onChange={(value) => set(key, value)}
        {...(hint ? { hint } : {})}
      />
    </div>
  );

  return (
    <section className="mt-20 border-t pt-10">
      <h2 className="type-h3">Site content</h2>

      <div className="mt-8 space-y-10">
        <div>
          <h3 className="type-label text-muted-foreground">Hero</h3>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <TextInput
              label="Eyebrow"
              value={draft["hero_eyebrow"] ?? ""}
              onChange={(value) => set("hero_eyebrow", value)}
            />
            <TextInput
              label="Headline"
              value={draft["hero_headline"] ?? ""}
              onChange={(value) => set("hero_headline", value)}
            />
            <div className="md:col-span-2">
              <TextArea
                label="Description"
                rows={3}
                value={draft["hero_description"] ?? ""}
                onChange={(value) => set("hero_description", value)}
              />
            </div>
            {text(
              "hero_note",
              "Hero handwritten note",
              "Short margin note beside the hero. Leave blank to hide it.",
            )}
            <div className="md:col-span-2">
              <ImagePicker
                label="Portrait"
                folder="hero"
                value={draft["hero_image_url"] || null}
                onChange={(value) => set("hero_image_url", value ?? "")}
                altValue={draft["hero_image_alt"] ?? ""}
                onAltChange={(value) => set("hero_image_alt", value)}
                hint="Shown in the Designer's note section on the homepage."
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="type-label text-muted-foreground">Introduction</h3>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            {area(
              "intro_heading",
              "Introduction statement",
              3,
              "Leave blank to hide the introduction section.",
            )}
            {area(
              "intro_capabilities",
              "Capabilities",
              2,
              "Comma-separated. Shown as a preview list under the statement.",
            )}
          </div>
        </div>

        <div>
          <h3 className="type-label text-muted-foreground">Work sections</h3>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            {text("work_heading", "Selected work heading")}
            {text(
              "work_note",
              "Selected work note",
              "Handwritten margin note. Leave blank to hide it.",
            )}
            {text("websites_heading", "Published websites heading")}
            {text("websites_description", "Published websites description")}
            {text("work_view_all_text", "View all work text", "Leave blank to hide the link.")}
            {text("work_view_all_url", "View all work URL", "Defaults to /work.")}
            {text("work_page_heading", "Work page heading")}
            {text("work_page_description", "Work page description")}
          </div>
        </div>

        <div>
          <h3 className="type-label text-muted-foreground">What I do</h3>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            {text("services_heading", "Heading")}
            {area("services_list", "Services", 6, "One per line as Title | Description.")}
          </div>
        </div>

        <div>
          <h3 className="type-label text-muted-foreground">Designer&apos;s note</h3>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            {text("about_label", "Section label")}
            {text("about_note", "Handwritten note", "Leave blank to hide it.")}
          </div>
        </div>

        <div>
          <h3 className="type-label text-muted-foreground">How I design</h3>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            {text("process_heading", "Heading")}
            {text("process_note", "Handwritten note", "Leave blank to hide it.")}
            {area("process_steps", "Steps", 6, "One per line as Title | Description, in order.")}
          </div>
        </div>

        <div>
          <h3 className="type-label text-muted-foreground">Other sections</h3>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            {text("experiments_heading", "Experiments heading")}
            {text("contact_note", "Contact handwritten note", "Leave blank to hide it.")}
            {text("footer_role", "Footer role line")}
          </div>
        </div>

        <div>
          <h3 className="type-label text-muted-foreground">Calls to action</h3>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <TextInput
              label="Primary CTA text"
              value={draft["primary_cta_text"] ?? ""}
              onChange={(value) => set("primary_cta_text", value)}
              hint="Rendered as a filled button."
            />
            <TextInput
              label="Primary CTA URL"
              value={draft["primary_cta_url"] ?? ""}
              onChange={(value) => set("primary_cta_url", value)}
              placeholder="/#work"
            />
            <TextInput
              label="Secondary CTA text"
              value={draft["secondary_cta_text"] ?? ""}
              onChange={(value) => set("secondary_cta_text", value)}
              hint="Rendered as a text link with an arrow."
            />
            <TextInput
              label="Secondary CTA URL"
              value={draft["secondary_cta_url"] ?? ""}
              onChange={(value) => set("secondary_cta_url", value)}
              placeholder="/#contact"
            />
          </div>
        </div>

        <div>
          <h3 className="type-label text-muted-foreground">About &amp; contact</h3>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <TextInput
              label="About heading"
              value={draft["about_heading"] ?? ""}
              onChange={(value) => set("about_heading", value)}
            />
            <TextInput
              label="Contact heading"
              value={draft["contact_heading"] ?? ""}
              onChange={(value) => set("contact_heading", value)}
              hint="Shown above the contact links on the homepage."
            />
            <div className="md:col-span-2">
              <TextArea
                label="About paragraph"
                rows={6}
                value={draft["about_paragraph"] ?? ""}
                onChange={(value) => set("about_paragraph", value)}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="type-label text-muted-foreground">Footer</h3>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <TextInput
              label="Footer headline"
              value={draft["footer_headline"] ?? ""}
              onChange={(value) => set("footer_headline", value)}
              hint="The closing statement above the footer links. Independent of the contact heading."
            />
            <TextInput
              label="Footer description"
              value={draft["footer_description"] ?? ""}
              onChange={(value) => set("footer_description", value)}
            />
          </div>
        </div>

        <div>
          <h3 className="type-label text-muted-foreground">Availability</h3>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <TextInput
              label="Availability label"
              value={draft["availability_label"] ?? ""}
              onChange={(value) => set("availability_label", value)}
              placeholder="Available for new projects"
              hint="Leave blank to hide the availability badge entirely."
            />
            <div className="flex items-end pb-2">
              <Toggle
                label="Open for work (controls the status dot colour)"
                value={draft["availability_open"] === "true"}
                onChange={(value) => set("availability_open", value ? "true" : "false")}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="type-label text-muted-foreground">Contact &amp; social links</h3>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <TextInput
              label="Email"
              value={draft["email"] ?? ""}
              onChange={(value) => set("email", value)}
            />
            <TextInput
              label="WhatsApp link"
              value={draft["whatsapp_url"] ?? ""}
              onChange={(value) => set("whatsapp_url", value)}
              placeholder="https://wa.me/234..."
            />
            <TextInput
              label="Response time note"
              value={draft["response_time_note"] ?? ""}
              onChange={(value) => set("response_time_note", value)}
              placeholder="Usually replies within 24 hours"
            />
            <TextInput
              label="Skills / focus areas"
              value={draft["contact_skills"] ?? ""}
              onChange={(value) => set("contact_skills", value)}
              placeholder="Product Design, Landing Pages, Dashboards"
              hint="Comma-separated — shown as tags above the contact links."
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
              label="X URL"
              value={draft["x_url"] ?? ""}
              onChange={(value) => set("x_url", value)}
            />
            <TextInput
              label="Instagram URL"
              value={draft["instagram_url"] ?? ""}
              onChange={(value) => set("instagram_url", value)}
            />
            <TextInput
              label="Resume URL"
              value={draft["resume_url"] ?? ""}
              onChange={(value) => set("resume_url", value)}
              hint="Leave empty to hide the resume link."
            />
          </div>
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
        {save.error ? <span className="type-meta">{describeSupabaseError(save.error)}</span> : null}
      </div>
    </section>
  );
}

function StudioHome() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const projects = useQuery(allProjectsQuery);
  const settings = useQuery(settingsQuery);

  const [deleteError, setDeleteError] = useState<string | null>(null);

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      setDeleteError(null);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => setDeleteError(describeSupabaseError(error)),
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
              <Link to="/studio/$id" params={{ id: project.id }} className="type-h3 link-underline">
                {project.title || "Untitled"}
              </Link>
              <p className="type-meta mt-1 text-muted-foreground">
                {project.project_type === "published-website" ? "Published Website" : "Case Study"}
                {" · "}
                {project.project_type === "published-website" ? "/websites/" : "/work/"}
                {project.slug} · order {project.sort_order} ·{" "}
                {project.published ? "Published" : "Draft"}
                {project.featured ? " · Featured" : ""}
              </p>
            </div>
            <div className="flex items-center gap-6">
              <Link
                to={
                  project.project_type === "published-website" ? "/websites/$slug" : "/work/$slug"
                }
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

      {deleteError ? (
        <p className="type-meta mt-4 border border-current p-4 text-muted-foreground">
          {deleteError}
        </p>
      ) : null}

      {projects.data ? <FeaturedReorder projects={projects.data} /> : null}

      {settings.data ? <SettingsPanel settings={settings.data} /> : null}
    </main>
  );
}
