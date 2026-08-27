import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { imageSrc, type Project } from "@/lib/cms";
import { describeSupabaseError } from "@/lib/studio";
import { supabase } from "@/integrations/supabase/client";

/**
 * Drag-and-drop reorder list, scoped to featured projects only.
 * Persists order by writing a fresh sort_order (0, 1, 2…) to each row on drop.
 * Reverts to the last known-good order if the write fails.
 */
export function FeaturedReorder({ projects }: { projects: Project[] }) {
  const queryClient = useQueryClient();

  const featured = [...projects]
    .filter((project) => project.featured && project.project_type === "case-study")
    .sort((a, b) => a.sort_order - b.sort_order || a.title.localeCompare(b.title));

  const [order, setOrder] = useState<Project[]>(featured);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Stay in sync when the underlying project list changes (new project, unfeatured, etc.)
  useEffect(() => {
    setOrder(featured);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects]);

  const persist = useMutation({
    mutationFn: async (next: Project[]) => {
      const updates = next.map((project, index) =>
        supabase.from("projects").update({ sort_order: index }).eq("id", project.id),
      );
      const results = await Promise.all(updates);
      const failed = results.find((result) => result.error);
      if (failed?.error) throw failed.error;
    },
    onSuccess: async () => {
      setError(null);
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (mutationError) => {
      setError(describeSupabaseError(mutationError));
      setOrder(featured); // revert to last known-good order
    },
  });

  function reorder(from: number, to: number) {
    if (from === to) return;
    const next = [...order];
    const [moved] = next.splice(from, 1);
    if (!moved) return;
    next.splice(to, 0, moved);
    setOrder(next);
    persist.mutate(next);
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= order.length) return;
    reorder(index, target);
  }

  if (!featured.length) return null;

  return (
    <section className="mt-16 border-t pt-10">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h2 className="type-h3">Featured order</h2>
        <span className="type-meta text-muted-foreground">
          Drag to reorder how featured projects appear on the homepage
        </span>
      </div>

      {error ? (
        <div className="type-meta mt-4 flex flex-wrap items-center gap-4 border border-current p-4 text-muted-foreground">
          <span>{error}</span>
          <button type="button" onClick={() => persist.mutate(order)} className="link-underline">
            Try again
          </button>
        </div>
      ) : null}

      <ul className="mt-6 border-t">
        {order.map((project, index) => {
          const src = imageSrc(project.cover_image_url ?? project.thumbnail_url);
          return (
            <li
              key={project.id}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(event) => {
                event.preventDefault();
                setOverIndex(index);
              }}
              onDragEnd={() => {
                setDragIndex(null);
                setOverIndex(null);
              }}
              onDrop={(event) => {
                event.preventDefault();
                if (dragIndex !== null) reorder(dragIndex, index);
                setDragIndex(null);
                setOverIndex(null);
              }}
              className={`flex items-center gap-4 border-b py-3 transition-opacity ${
                dragIndex === index ? "opacity-40" : ""
              } ${overIndex === index && dragIndex !== null && dragIndex !== index ? "bg-secondary" : ""}`}
            >
              <span
                aria-hidden
                className="type-meta cursor-grab select-none text-muted-foreground active:cursor-grabbing"
                title="Drag to reorder"
              >
                ⠿
              </span>

              {src ? (
                <img src={src} alt="" className="size-10 shrink-0 bg-secondary object-cover" />
              ) : (
                <span className="size-10 shrink-0 bg-secondary" aria-hidden />
              )}

              <span className="type-meta flex-1 truncate">{project.title || "Untitled"}</span>
              <span className="type-meta hidden text-muted-foreground sm:inline">
                /work/{project.slug}
              </span>

              <span className="flex shrink-0 gap-3">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="type-meta link-underline text-muted-foreground disabled:pointer-events-none disabled:opacity-30"
                  aria-label={`Move ${project.title || "project"} up`}
                >
                  Up
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === order.length - 1}
                  className="type-meta link-underline text-muted-foreground disabled:pointer-events-none disabled:opacity-30"
                  aria-label={`Move ${project.title || "project"} down`}
                >
                  Down
                </button>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
