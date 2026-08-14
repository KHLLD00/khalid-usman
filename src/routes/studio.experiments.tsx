import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { ImagePicker, TextArea, TextInput, Toggle } from "@/components/studio/Fields";
import { supabase } from "@/integrations/supabase/client";
import { allExperimentsQuery, type Experiment } from "@/lib/cms";
import { describeSupabaseError } from "@/lib/studio";

export const Route = createFileRoute("/studio/experiments")({
  component: ExperimentsStudio,
});

function newExperiment(sortOrder: number): Experiment {
  return {
    id: crypto.randomUUID(),
    title: "",
    description: "",
    category: "",
    year: "",
    image_url: null,
    image_alt: "",
    external_url: "",
    sort_order: sortOrder,
    published: false,
  };
}

function ExperimentsStudio() {
  const queryClient = useQueryClient();
  const { data } = useQuery(allExperimentsQuery);

  const [draft, setDraft] = useState<Experiment[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (data) setDraft(data);
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      if (draft.length) {
        const { error } = await supabase.from("experiments").upsert(draft);
        if (error) throw error;
      }
      if (deletedIds.length) {
        const { error } = await supabase.from("experiments").delete().in("id", deletedIds);
        if (error) throw error;
      }
    },
    onSuccess: async () => {
      setStatus("Saved");
      setDeletedIds([]);
      await queryClient.invalidateQueries({ queryKey: allExperimentsQuery.queryKey });
      await queryClient.invalidateQueries({ queryKey: ["experiments", "published"] });
    },
    onError: (error) => setStatus(describeSupabaseError(error)),
  });

  function update(index: number, patch: Partial<Experiment>) {
    setStatus(null);
    setDraft((current) => current.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= draft.length) return;
    setStatus(null);
    setDraft((current) => {
      const next = [...current];
      const [item] = next.splice(index, 1);
      if (item) next.splice(target, 0, item);
      return next.map((row, i) => ({ ...row, sort_order: i }));
    });
  }

  function remove(index: number) {
    setStatus(null);
    setDraft((current) => {
      const item = current[index];
      if (item) setDeletedIds((ids) => [...ids, item.id]);
      return current.filter((_, i) => i !== index);
    });
  }

  function addRow() {
    setStatus(null);
    setDraft((current) => [...current, newExperiment(current.length)]);
  }

  return (
    <main className="shell py-16">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="type-h2">Experiments</h1>
        <button
          type="button"
          onClick={addRow}
          className="type-meta bg-primary px-6 py-3 text-primary-foreground transition-opacity hover:opacity-85"
        >
          New experiment
        </button>
      </div>
      <p className="type-meta mt-3 max-w-[56ch] text-muted-foreground">
        Smaller design explorations shown separately from Selected Work. Layout, grid, and hover
        behaviour stay fixed in code.
      </p>

      <div className="mt-10 space-y-6">
        {draft.map((item, index) => (
          <div key={item.id} className="space-y-4 border p-4">
            <div className="flex items-center justify-between">
              <span className="type-meta text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="type-meta link-underline text-muted-foreground disabled:pointer-events-none disabled:opacity-30"
                >
                  Up
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === draft.length - 1}
                  className="type-meta link-underline text-muted-foreground disabled:pointer-events-none disabled:opacity-30"
                >
                  Down
                </button>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="type-meta link-underline text-muted-foreground"
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <TextInput
                label="Title"
                value={item.title}
                onChange={(title) => update(index, { title })}
              />
              <TextInput
                label="Category"
                value={item.category}
                onChange={(category) => update(index, { category })}
              />
              <TextInput
                label="Year"
                value={item.year}
                onChange={(year) => update(index, { year })}
              />
              <TextInput
                label="External / project URL"
                value={item.external_url}
                onChange={(external_url) => update(index, { external_url })}
                placeholder="https://…"
              />
            </div>

            <TextArea
              label="Description"
              rows={3}
              value={item.description}
              onChange={(description) => update(index, { description })}
            />

            <ImagePicker
              label="Image"
              folder="experiments"
              value={item.image_url}
              onChange={(image_url) => update(index, { image_url })}
              altValue={item.image_alt}
              onAltChange={(image_alt) => update(index, { image_alt })}
            />

            <Toggle
              label="Published"
              value={item.published}
              onChange={(published) => update(index, { published })}
            />
          </div>
        ))}
        {!draft.length ? (
          <p className="type-meta text-muted-foreground">No experiments yet.</p>
        ) : null}
      </div>

      <div className="mt-8 flex items-center gap-6">
        <button
          type="button"
          onClick={() => save.mutate()}
          disabled={save.isPending}
          className="type-meta bg-primary px-6 py-3 text-primary-foreground transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          {save.isPending ? "Saving…" : "Save experiments"}
        </button>
        {status ? <span className="type-meta text-muted-foreground">{status}</span> : null}
      </div>
    </main>
  );
}
