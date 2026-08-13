import { Link } from "@tanstack/react-router";

import { Reveal } from "@/components/site/Reveal";
import { imageSrc, type Project } from "@/lib/cms";
import { cn } from "@/lib/utils";

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const src = imageSrc(project.cover_image_url ?? project.thumbnail_url);
  const offset = index % 2 === 0;

  return (
    <Reveal as="article" className="rule-top pt-8 md:pt-12">
      <Link
        to="/work/$slug"
        params={{ slug: project.slug }}
        className="group block"
        aria-label={`${project.title} — view case study`}
      >
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-2">
            <span className="type-label text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          <div className={cn("md:col-span-6", !offset && "md:col-start-3")}>
            <h3 className="type-h1 transition-transform duration-500 ease-editorial group-hover:translate-x-1">
              {project.title}
            </h3>
            {project.short_description ? (
              <p className="type-body mt-3 max-w-[46ch] text-muted-foreground">
                {project.short_description}
              </p>
            ) : null}
          </div>

          <div className="type-meta text-muted-foreground md:col-span-4 md:text-right">
            {project.category ? <p>{project.category}</p> : null}
            <p className="mt-1">
              {[project.role, project.year].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>

        {src ? (
          <div
            className={cn(
              "mt-8 overflow-hidden bg-secondary md:mt-12",
              offset ? "md:mr-[8%]" : "md:ml-[8%]",
            )}
          >
            <img
              src={src}
              alt={project.cover_image_alt || `${project.title} project cover`}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              className="aspect-[16/11] w-full object-cover transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.02]"
            />
          </div>
        ) : null}

        <p className="type-meta mt-6 inline-flex items-center gap-2 md:mt-8">
          <span className="link-underline">View case study</span>
          <span className="arrow-shift group-hover:translate-x-1 group-hover:-translate-y-1">
            ↗
          </span>
        </p>
      </Link>
    </Reveal>
  );
}

export function ProjectList({ projects }: { projects: Project[] }) {
  if (!projects.length) {
    return (
      <p className="type-body rule-top pt-8 text-muted-foreground">
        No projects published yet. Sign in to the studio to add the first case study.
      </p>
    );
  }

  return (
    <div className="space-y-24 md:space-y-40">
      {projects.map((project, index) => (
        <ProjectRow key={project.id} project={project} index={index} />
      ))}
    </div>
  );
}
