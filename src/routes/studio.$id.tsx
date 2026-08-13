import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import {
  Field,
  GalleryEditor,
  ImagePicker,
  TextArea,
  TextInput,
  Toggle,
  inputClass,
} from "@/components/studio/Fields";
import { supabase } from "@/integrations/supabase/client";
import type { ContentBlock } from "@/lib/cms";
import {
  BLOCK_TYPES,
  emptyProject,
  makeBlock,
  slugify,
  type ProjectDraft,
} from "@/lib/studio";

export const Route = createFileRoute("/studio/$id")({
  component: ProjectEditor,
});

function BlockEditor({
  blocks,
  onChange,
}: {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}) {
  const [type, setType] = useState<ContentBlock["type"]>("rich-text");

  function update(index: number, next: ContentBlock) {
    onChange(blocks.map((block, i) => (i === index ? next : block)));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    const [item] = next.splice(index, 1);
    if (item) next.splice(target, 0, item);
    onChange(next);
  }

  return (
    <section className="mt-16 border-t pt-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="type-h3">Case study blocks</h2>
        <div className="flex items-center gap-3">
          <select
            value={type}
            onChange={(event) => setType(event.target.value as ContentBlock["type"])}
            className="border px-3 py-2 text-sm"
          >
            {BLOCK_TYPES.map((option) => (
              <option key={option.type} value={option.type}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => onChange([...blocks, makeBlock(type)])}
            className="type-meta bg-primary px-5 py-2 text-primary-foreground transition-opacity hover:opacity-85"
          >
            Add block
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {blocks.map((block, index) => (
          <div key={index} className="space-y-4 border p-5">
            <div className="flex items-center justify-between">
              <span className="type-label text-muted-foreground">
                {String(index + 1).padStart(2, "0")} ·{" "}
                {BLOCK_TYPES.find((option) => option.type === block.type)?.label ?? block.type}
              </span>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  className="type-meta link-underline"
                >
                  Up
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  className="type-meta link-underline"
                >
                  Down
                </button>
                <button
                  type="button"
                  onClick={() => onChange(blocks.filter((_, i) => i !== index))}
                  className="type-meta link-underline text-muted-foreground"
                >
                  Remove
                </button>
              </div>
            </div>

            {block.type === "heading" ? (
              <TextInput
                label="Heading"
                value={block.text}
                onChange={(text) => update(index, { ...block, text })}
              />
            ) : null}

            {block.type === "rich-text" ? (
              <TextArea
                label="Text"
                rows={6}
                value={block.text}
                onChange={(text) => update(index, { ...block, text })}
                hint="Blank lines create paragraphs. Lines starting with “- ” create a list."
              />
            ) : null}

            {block.type === "quote" ? (
              <>
                <TextArea
                  label="Quote"
                  rows={3}
                  value={block.text}
                  onChange={(text) => update(index, { ...block, text })}
                />
                <TextInput
                  label="Attribution"
                  value={block.attribution ?? ""}
                  onChange={(attribution) => update(index, { ...block, attribution })}
                />
              </>
            ) : null}

            {block.type === "image" ? (
              <>
                <GalleryEditor
                  label="Image"
                  images={[block.image]}
                  onChange={(images) =>
                    update(index, { ...block, image: images[0] ?? block.image })
                  }
                />
                <Field label="Width">
                  <select
                    value={block.width ?? "wide"}
                    onChange={(event) =>
                      update(index, {
                        ...block,
                        width: event.target.value as "full" | "wide" | "text",
                      })
                    }
                    className={inputClass}
                  >
                    <option value="wide">Contained</option>
                    <option value="full">Full bleed</option>
                    <option value="text">Text width</option>
                  </select>
                </Field>
              </>
            ) : null}

            {block.type === "gallery" ? (
              <>
                <GalleryEditor
                  label="Images"
                  images={block.images}
                  onChange={(images) => update(index, { ...block, images })}
                />
                <Field label="Columns">
                  <select
                    value={String(block.columns ?? 2)}
                    onChange={(event) =>
                      update(index, {
                        ...block,
                        columns: Number(event.target.value) === 3 ? 3 : 2,
                      })
                    }
                    className={inputClass}
                  >
                    <option value="2">Two columns</option>
                    <option value="3">Three columns</option>
                  </select>
                </Field>
              </>
            ) : null}

            {block.type === "compare" ? (
              <GalleryEditor
                label="Two images"
                images={block.images}
                onChange={(images) => update(index, { ...block, images })}
              />
            ) : null}

            {block.type === "text-image" ? (
              <>
                <TextInput
                  label="Heading"
                  value={block.heading ?? ""}
                  onChange={(heading) => update(index, { ...block, heading })}
                />
                <TextArea
                  label="Text"
                  rows={5}
                  value={block.text}
                  onChange={(text) => update(index, { ...block, text })}
                />
                <GalleryEditor
                  label="Image"
                  images={[block.image]}
                  onChange={(images) =>
                    update(index, { ...block, image: images[0] ?? block.image })
                  }
                />
              </>
            ) : null}

            {block.type === "video" ? (
              <>
                <TextInput
                  label="Embed URL"
                  value={block.url}
                  onChange={(url) => update(index, { ...block, url })}
                  hint="Use an embed URL, e.g. https://player.vimeo.com/video/…"
                />
                <TextInput
                  label="Caption"
                  value={block.caption ?? ""}
                  onChange={(caption) => update(index, { ...block, caption })}
                />
              </>
            ) : null}

            {block.type === "metrics" ? (
              <div className="space-y-4">
                {block.items.map((item, i) => (
                  <div key={i} className="grid gap-4 sm:grid-cols-2">
                    <TextInput
                      label="Label"
                      value={item.label}
                      onChange={(label) =>
                        update(index, {
                          ...block,
                          items: block.items.map((entry, j) =>
                            j === i ? { ...entry, label } : entry,
                          ),
                        })
                      }
                    />
                    <TextInput
                      label="Value"
                      value={item.value}
                      onChange={(value) =>
                        update(index, {
                          ...block,
                          items: block.items.map((entry, j) =>
                            j === i ? { ...entry, value } : entry,
                          ),
                        })
                      }
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    update(index, { ...block, items: [...block.items, { label: "", value: "" }] })
                  }
                  className="type-meta link-underline"
                >
                  Add metric
                </button>
              </div>
            ) : null}

            {block.type === "timeline" ? (
              <div className="space-y-4">
                {block.items.map((item, i) => (
                  <div key={i} className="grid gap-4 sm:grid-cols-2">
                    <TextInput
                      label="Step"
                      value={item.label}
                      onChange={(label) =>
                        update(index, {
                          ...block,
                          items: block.items.map((entry, j) =>
                            j === i ? { ...entry, label } : entry,
                          ),
                        })
                      }
                    />
                    <TextInput
                      label="Description"
                      value={item.description ?? ""}
                      onChange={(description) =>
                        update(index, {
                          ...block,
                          items: block.items.map((entry, j) =>
                            j === i ? { ...entry, description } : entry,
                          ),
                        })
                      }
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    update(index, {
                      ...block,
                      items: [...block.items, { label: "", description: "" }],
                    })
                  }
                  className="type-meta link-underline"
                >
                  Add step
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function ProjectEditor() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = id === "new";
  const [draft, setDraft] = useState<ProjectDraft>(emptyProject());
  const [status, setStatus] = useState<string | null>(null);

  const existing = useQuery({
    queryKey: ["studio-project", id],
    enabled: !isNew,
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (existing.data) setDraft(existing.data as unknown as ProjectDraft);
  }, [existing.data]);

  function set<K extends keyof ProjectDraft>(key: K, value: ProjectDraft[K]) {
    setStatus(null);
    setDraft((current) => ({ ...current, [key]: value }));
  }

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        ...draft,
        slug: draft.slug ? slugify(draft.slug) : slugify(draft.title),
      };
      delete (payload as Record<string, unknown>)["created_at"];
      delete (payload as Record<string, unknown>)["updated_at"];

      if (isNew) {
        delete (payload as Record<string, unknown>)["id"];
        const { data, error } = await supabase
          .from("projects")
          .insert(payload as never)
          .select("id")
          .single();
        if (error) throw error;
        return data.id as string;
      }

      const { error } = await supabase
        .from("projects")
        .update(payload as never)
        .eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: async (savedId) => {
      setStatus("Saved");
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      await queryClient.invalidateQueries({ queryKey: ["project"] });
      if (isNew) navigate({ to: "/studio/$id", params: { id: savedId } });
    },
    onError: (error) => setStatus((error as Error).message),
  });

  return (
    <main className="shell py-16">
      <Link to="/studio" className="type-meta link-underline text-muted-foreground">
        ← All projects
      </Link>

      <h1 className="type-h2 mt-6">{isNew ? "New project" : draft.title || "Untitled"}</h1>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <TextInput label="Title" value={draft.title} onChange={(value) => set("title", value)} />
        <TextInput
          label="Slug"
          value={draft.slug}
          onChange={(value) => set("slug", value)}
          hint="Leave empty to generate from the title."
        />
        <TextInput
          label="Category"
          value={draft.category}
          onChange={(value) => set("category", value)}
          placeholder="Financial platform"
        />
        <TextInput label="Year" value={draft.year} onChange={(value) => set("year", value)} />
        <TextInput
          label="Role"
          value={draft.role}
          onChange={(value) => set("role", value)}
          placeholder="Product Design · UI/UX"
        />
        <TextInput
          label="Tools (comma separated)"
          value={draft.tools.join(", ")}
          onChange={(value) =>
            set(
              "tools",
              value
                .split(",")
                .map((tool) => tool.trim())
                .filter(Boolean),
            )
          }
        />
        <TextArea
          label="Short description"
          rows={3}
          value={draft.short_description}
          onChange={(value) => set("short_description", value)}
        />
        <div className="space-y-4 self-end">
          <TextInput
            label="Sort order"
            value={String(draft.sort_order)}
            onChange={(value) => set("sort_order", Number(value) || 0)}
          />
          <Toggle
            label="Featured on homepage"
            value={draft.featured}
            onChange={(value) => set("featured", value)}
          />
          <Toggle
            label="Published"
            value={draft.published}
            onChange={(value) => set("published", value)}
          />
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <ImagePicker
            label="Cover image"
            value={draft.cover_image_url}
            onChange={(value) => set("cover_image_url", value)}
          />
          <TextInput
            label="Cover alt text"
            value={draft.cover_image_alt}
            onChange={(value) => set("cover_image_alt", value)}
          />
        </div>
        <div className="space-y-4">
          <ImagePicker
            label="Hero image (case study)"
            value={draft.hero_image_url}
            onChange={(value) => set("hero_image_url", value)}
          />
          <TextInput
            label="Hero alt text"
            value={draft.hero_image_alt}
            onChange={(value) => set("hero_image_alt", value)}
          />
        </div>
      </div>

      <section className="mt-16 border-t pt-10">
        <h2 className="type-h3">Case study copy</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <TextArea
            label="Overview"
            value={draft.overview}
            onChange={(value) => set("overview", value)}
          />
          <TextArea
            label="Problem"
            value={draft.problem}
            onChange={(value) => set("problem", value)}
          />
          <TextArea
            label="Research"
            value={draft.research}
            onChange={(value) => set("research", value)}
          />
          <TextArea
            label="Insights"
            value={draft.insights}
            onChange={(value) => set("insights", value)}
          />
          <TextArea
            label="Design process"
            value={draft.design_process}
            onChange={(value) => set("design_process", value)}
          />
          <TextArea
            label="Design decisions"
            value={draft.design_decisions}
            onChange={(value) => set("design_decisions", value)}
          />
          <TextArea
            label="Final solution"
            value={draft.final_solution}
            onChange={(value) => set("final_solution", value)}
          />
          <TextArea
            label="Results / outcomes"
            value={draft.results}
            onChange={(value) => set("results", value)}
          />
          <TextArea
            label="Reflection"
            value={draft.reflection}
            onChange={(value) => set("reflection", value)}
          />
          <TextArea
            label="External links (one per line, Label | URL)"
            value={draft.external_links.map((link) => `${link.label} | ${link.url}`).join("\n")}
            onChange={(value) =>
              set(
                "external_links",
                value
                  .split("\n")
                  .map((line) => line.split("|").map((part) => part.trim()))
                  .filter((parts) => parts[0] || parts[1])
                  .map((parts) => ({ label: parts[0] ?? "", url: parts[1] ?? "" })),
              )
            }
          />
        </div>
      </section>

      <section className="mt-16 border-t pt-10">
        <h2 className="type-h3">Gallery</h2>
        <div className="mt-8">
          <GalleryEditor
            label="Gallery images"
            images={draft.gallery}
            onChange={(images) => set("gallery", images)}
          />
        </div>
      </section>

      <BlockEditor
        blocks={draft.content_blocks}
        onChange={(blocks) => set("content_blocks", blocks)}
      />

      <div className="sticky bottom-0 mt-16 flex items-center gap-6 border-t bg-background py-6">
        <button
          type="button"
          onClick={() => save.mutate()}
          disabled={save.isPending || !draft.title}
          className="type-meta bg-primary px-8 py-3 text-primary-foreground transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          {save.isPending ? "Saving…" : "Save project"}
        </button>
        {status ? <span className="type-meta text-muted-foreground">{status}</span> : null}
      </div>
    </main>
  );
}
