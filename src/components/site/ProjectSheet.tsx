import { Link } from "@tanstack/react-router";

import { LivePreview } from "@/components/site/LivePreview";
import { Reveal } from "@/components/site/Reveal";
import { imageSrc, type Project } from "@/lib/cms";
import { cn } from "@/lib/utils";
import { projectViewTransitionName, useViewTransitionEnabled } from "@/lib/view-transition";

const LAYOUTS = ["media-right", "media-left", "stacked"] as const;

function ProjectSheet({ project, index }: { project: Project; index: number }) {
  const layout = LAYOUTS[index % LAYOUTS.length];
  const viewTransition = useViewTransitionEnabled();
  const isWebsite = project.project_type === "published-website";
  const src = imageSrc(project.cover_image_url ?? project.thumbnail_url);
  const number = String(index + 1).padStart(2, "0");

  const heading = (
    <div>
      <p className="type-label flex items-center gap-3 text-muted-foreground">
        <span className="text-cobalt">No. {number}</span>
        {project.category ? <span>{project.category}</span> : null}
      </p>
      <h3 className="type-h1 mt-5 transition-colors duration-500 group-hover:text-cobalt">
        {isWebsite ? (
          project.title
        ) : (
          <Link
            to="/work/$slug"
            params={{ slug: project.slug }}
            viewTransition={viewTransition}
            aria-label={`View case study: ${project.title}`}
            className="after:absolute after:inset-0"
          >
            {project.title}
          </Link>
        )}
      </h3>
      {project.short_description ? (
        <p className="type-body mt-4 max-w-[46ch] text-muted-foreground">
          {project.short_description}
        </p>
      ) : null}
    </div>
  );

  const meta =
    project.role || project.year ? (
      <dl className="type-meta grid grid-cols-2 gap-x-6 gap-y-4 border-t pt-4">
        {project.role ? (
          <div>
            <dt className="text-muted-foreground">Role</dt>
            <dd className="mt-1">{project.role}</dd>
          </div>
        ) : null}
        {project.year ? (
          <div>
            <dt className="text-muted-foreground">Year</dt>
            <dd className="mt-1">{project.year}</dd>
          </div>
        ) : null}
      </dl>
    ) : null;

  const cta = isWebsite ? (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      {project.live_website_url ? (
        <a
          href={project.live_website_url}
          target="_blank"
          rel="noreferrer"
          className="type-meta group/visit inline-flex items-center gap-2"
        >
          <span className="link-underline">Visit website</span>
          <span className="arrow-shift group-hover/visit:translate-x-1 group-hover/visit:-translate-y-1">
            ↗
          </span>
        </a>
      ) : null}
      <Link
        to="/websites/$slug"
        params={{ slug: project.slug }}
        className="type-meta link-underline text-muted-foreground"
      >
        View details
      </Link>
    </div>
  ) : (
    <p className="type-meta inline-flex items-center gap-2">
      <span className="link-underline">View case study</span>
      <span className="arrow-shift group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
    </p>
  );

  const media = isWebsite ? (
    <div className="sheet-media">
      <LivePreview project={project} />
    </div>
  ) : src ? (
    <div className="sheet-media overflow-hidden bg-secondary">
      <div className="sheet-parallax">
        <img
          src={src}
          alt={project.cover_image_alt || `${project.title} project cover`}
          loading={index === 0 ? "eager" : "lazy"}
          decoding="async"
          style={{ viewTransitionName: projectViewTransitionName(project.id) }}
          className="aspect-[16/11] w-full object-cover transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.03]"
        />
      </div>
    </div>
  ) : null;

  return (
    <Reveal as="article" className="sheet group relative border bg-card p-6 md:p-10">
      {layout === "stacked" ? (
        <div className="grid gap-8 md:gap-12">
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">{heading}</div>
            <div className="flex flex-col gap-6 md:col-span-5">
              {meta}
              {cta}
            </div>
          </div>
          {media ? <div className="-mx-3 md:-mx-6 md:-mb-16 xl:-mx-10">{media}</div> : null}
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-12 md:gap-10">
          <div
            className={cn(
              "flex flex-col gap-8 md:col-span-5 md:py-2",
              layout === "media-left" && "md:order-2",
            )}
          >
            {heading}
            {meta}
            <div className="md:mt-auto">{cta}</div>
          </div>
          {media ? (
            <div
              className={cn(
                "-mx-3 md:col-span-7 md:mx-0 md:-mb-14",
                layout === "media-left" ? "md:order-1 md:-ml-10 xl:-ml-16" : "md:-mr-10 xl:-mr-16",
              )}
            >
              {media}
            </div>
          ) : null}
        </div>
      )}
    </Reveal>
  );
}

export function ProjectSheets({ projects, empty }: { projects: Project[]; empty?: string }) {
  if (!projects.length) {
    return empty ? <p className="type-body rule-top pt-8 text-muted-foreground">{empty}</p> : null;
  }

  return (
    <div className="space-y-28 md:space-y-44">
      {projects.map((project, index) => (
        <ProjectSheet key={project.id} project={project} index={index} />
      ))}
    </div>
  );
}
