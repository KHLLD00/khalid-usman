import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { TextInput, Toggle } from "@/components/studio/Fields";
import { supabase } from "@/integrations/supabase/client";
import { allToolkitItemsQuery, type ToolkitItem } from "@/lib/cms";
import { describeSupabaseError } from "@/lib/studio";

export const Route = createFileRoute("/studio/toolkit")({
  component: ToolkitStudio,
});

function newToolkitItem(sortOrder: number): ToolkitItem {
  return { id: crypto.randomUUID(), name: "", category: "", sort_order: sortOrder, visible: true };
}

function ToolkitStudio() {
  const queryClient = useQueryClient();
  const { data } = useQuery(allToolkitItemsQuery);

  const [draft, setDraft] = useState<ToolkitItem[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (data) setDraft(data);
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      if (draft.length) {
        const { error } = await supabase.from("toolkit_items").upsert(draft);
        if (error) throw error;
      }
      if (deletedIds.length) {
        const { error } = await supabase.from("toolkit_items").delete().in("id", deletedIds);
        if (error) throw error;
      }
    },
    onSuccess: async () => {
      setStatus("Saved");
      setDeletedIds([]);
      await queryClient.invalidateQueries({ queryKey: allToolkitItemsQuery.queryKey });
      await queryClient.invalidateQueries({ queryKey: ["toolkit-items", "visible"] });
    },
    onError: (error) => setStatus(describeSupabaseError(error)),
  });

  function update(index: number, patch: Partial<ToolkitItem>) {
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
    setDraft((current) => [...current, newToolkitItem(current.length)]);
  }

  return (
    <main className="shell py-16">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="type-h2">Toolkit</h1>
        <button
          type="button"
          onClick={addRow}
          className="type-meta bg-primary px-6 py-3 text-primary-foreground transition-opacity hover:opacity-85"
        >
          Add item
        </button>
      </div>
      <p className="type-meta mt-3 max-w-[52ch] text-muted-foreground">
        Content, order, and visibility for the homepage toolkit ticker. Animation speed and
        typography stay fixed in code.
      </p>

      <div className="mt-10 space-y-4">
        {draft.map((item, index) => (
          <div key={item.id} className="grid gap-4 border p-4 md:grid-cols-12 md:items-end">
            <div className="md:col-span-4">
              <TextInput
                label="Name"
                value={item.name}
                onChange={(name) => update(index, { name })}
                placeholder="Figma"
              />
            </div>
            <div className="md:col-span-4">
              <TextInput
                label="Category (optional)"
                value={item.category ?? ""}
                onChange={(category) => update(index, { category })}
                placeholder="Tools"
              />
            </div>
            <div className="flex items-center gap-6 md:col-span-4">
              <Toggle
                label="Visible"
                value={item.visible}
                onChange={(visible) => update(index, { visible })}
              />
            </div>
            <div className="flex gap-4 md:col-span-12">
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
        ))}
        {!draft.length ? (
          <p className="type-meta text-muted-foreground">No toolkit items yet.</p>
        ) : null}
      </div>

      <div className="mt-8 flex items-center gap-6">
        <button
          type="button"
          onClick={() => save.mutate()}
          disabled={save.isPending}
          className="type-meta bg-primary px-6 py-3 text-primary-foreground transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          {save.isPending ? "Saving…" : "Save toolkit"}
        </button>
        {status ? <span className="type-meta text-muted-foreground">{status}</span> : null}
      </div>
    </main>
  );
}
