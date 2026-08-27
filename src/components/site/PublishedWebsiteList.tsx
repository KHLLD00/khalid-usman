import { Link } from "@tanstack/react-router";

import { LivePreview } from "@/components/site/LivePreview";
import { Reveal } from "@/components/site/Reveal";
import type { Project } from "@/lib/cms";
import { cn } from "@/lib/utils";

function WebsiteRow({ project, index }: { project: Project; index: number }) {
  const offset = index % 2 === 0;

  return (
    <Reveal as="article" className="rule-top pt-8 md:pt-12">
      <div className="grid gap-6 md:grid-cols-12 md:items-end">
        <div className="md:col-span-2">
          <span className="type-label text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className={cn("md:col-span-6", !offset && "md:col-start-3")}>
          <h3 className="type-h1">{project.title}</h3>
          {project.short_description ? (
            <p className="type-body mt-3 max-w-[46ch] text-muted-foreground">
              {project.short_description}
            </p>
          ) : null}
        </div>

        <div className="type-meta text-muted-foreground md:col-span-4 md:text-right">
          {project.category ? <p>{project.category}</p> : null}
          <p className="mt-1">{[project.role, project.year].filter(Boolean).join(" · ")}</p>
        </div>
      </div>

      <div className={cn("mt-8 md:mt-12", offset ? "md:mr-[8%]" : "md:ml-[8%]")}>
        <LivePreview project={project} />
      </div>

      <div className="mt-6 flex items-center gap-6 md:mt-8">
        {project.live_website_url ? (
          <a
            href={project.live_website_url}
            target="_blank"
            rel="noreferrer"
            className="type-meta group inline-flex items-center gap-2"
          >
            <span className="link-underline">Visit website</span>
            <span className="arrow-shift group-hover:translate-x-1 group-hover:-translate-y-1">
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
    </Reveal>
  );
}

export function PublishedWebsiteList({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;

  return (
    <div className="space-y-24 md:space-y-40">
      {projects.map((project, index) => (
        <WebsiteRow key={project.id} project={project} index={index} />
      ))}
    </div>
  );
}
