import type { ReactNode } from "react";

import { stagger } from "@/lib/utils";

export type MetaRow = { label: string; value: ReactNode };

/** Shared title block for case study and website detail pages. */
export function ProjectHeader({
  crumb,
  category,
  title,
  description,
  cta,
  meta,
}: {
  crumb: ReactNode;
  category: string;
  title: string;
  description?: string | null | undefined;
  cta?: ReactNode;
  meta: MetaRow[];
}) {
  return (
    <div className="paper-lines">
      <header className="shell pb-12 pt-32 md:pb-20 md:pt-48">
        <div
          className="hero-in flex items-baseline justify-between gap-6 border-b pb-4"
          style={stagger(0)}
        >
          <p className="type-label text-muted-foreground">
            {crumb}
            <span className="mx-3">/</span>
            {category}
          </p>
          <span className="page-no type-label text-muted-foreground" aria-hidden />
        </div>
        <h1 className="type-display hero-in mt-10 max-w-[18ch] md:mt-16" style={stagger(1)}>
          {title}
        </h1>
        <div className="mt-12 grid gap-10 md:mt-20 md:grid-cols-12">
          <div className="hero-in md:col-span-5" style={stagger(2)}>
            {description ? (
              <p className="type-body max-w-[44ch] text-muted-foreground">{description}</p>
            ) : null}
            {cta ? <div className="mt-8">{cta}</div> : null}
          </div>
          {meta.length ? (
            <dl
              className="sheet type-meta hero-in divide-y self-start border bg-card p-5 md:col-span-4 md:col-start-9"
              style={stagger(3)}
            >
              {meta.map((row, index) => (
                <div key={`${row.label}-${index}`} className="py-3 first:pt-0 last:pb-0">
                  <dt className="text-muted-foreground">{row.label}</dt>
                  <dd className="mt-1">{row.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </header>
    </div>
  );
}
