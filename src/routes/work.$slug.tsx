import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { ContentBlocks, Figure } from "@/components/site/ContentBlocks";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { ProjectHeader, type MetaRow } from "@/components/site/ProjectHeader";
import { Reveal } from "@/components/site/Reveal";
import { RichText } from "@/components/site/RichText";
import {
  imageSrc,
  navItemsQuery,
  projectQuery,
  projectsQuery,
  settingsQuery,
  SETTINGS_FALLBACK,
  type Project,
} from "@/lib/cms";
import { projectViewTransitionName, useViewTransitionEnabled } from "@/lib/view-transition";

export const Route = createFileRoute("/work/$slug")({
  loader: async ({ context, params }) => {
    const [project] = await Promise.all([
      context.queryClient.ensureQueryData(projectQuery(params.slug)),
      context.queryClient.ensureQueryData(projectsQuery),
      context.queryClient.ensureQueryData(settingsQuery),
      context.queryClient.ensureQueryData(navItemsQuery),
    ]);
    if (!project || !project.published) throw notFound();
    return {
      title: project.title,
      description: project.short_description,
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Unavailable | Khalid Usman" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.title} | Khalid Usman`;
    const description =
      loaderData.description || `${loaderData.title}, a case study by Khalid Usman.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CaseStudy,
});

function Section({
  label,
  heading,
  text,
}: {
  label: string;
  heading?: string | undefined;
  text?: string | undefined;
}) {
  if (!text || !text.trim()) return null;
  return (
    <Reveal as="section" className="shell">
      <div className="grid gap-6 border-t pt-6 md:grid-cols-12">
        <h2 className="type-label flex gap-3 pt-2 text-muted-foreground md:col-span-3">
          <span className="section-no text-cobalt" aria-hidden />
          <span>{label}</span>
        </h2>
        <div className="md:col-span-8">
          {heading ? <h3 className="type-h2 mb-6 max-w-[24ch]">{heading}</h3> : null}
          <RichText text={text} />
        </div>
      </div>
    </Reveal>
  );
}

function NextProject({ project }: { project: Project }) {
  const src = imageSrc(project.cover_image_url ?? project.thumbnail_url);
  const viewTransition = useViewTransitionEnabled();
  return (
    <section className="rule-top">
      <div className="shell py-20 md:py-32">
        <Link
          to="/work/$slug"
          params={{ slug: project.slug }}
          viewTransition={viewTransition}
          className="group block"
        >
          <p className="type-label text-muted-foreground">Next project</p>
          <div className="mt-8 grid gap-8 md:grid-cols-12 md:items-center">
            <div className="md:col-span-7">
              <h2 className="type-h1 transition-[color,transform] duration-500 ease-editorial group-hover:translate-x-1 group-hover:text-cobalt">
                {project.title}
              </h2>
              <p className="type-meta mt-4 inline-flex items-center gap-2 text-muted-foreground">
                <span className="link-underline">View case study</span>
                <span className="arrow-shift group-hover:translate-x-1 group-hover:-translate-y-1">
                  ↗
                </span>
              </p>
            </div>
            {src ? (
              <div className="overflow-hidden border bg-card p-2 md:col-span-5">
                <img
                  src={src}
                  alt={project.cover_image_alt || `${project.title} project cover`}
                  loading="lazy"
                  decoding="async"
                  style={{ viewTransitionName: projectViewTransitionName(project.id) }}
                  className="aspect-[16/10] w-full object-cover transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.02]"
                />
              </div>
            ) : null}
          </div>
        </Link>
      </div>
    </section>
  );
}

function CaseStudy() {
  const { slug } = Route.useParams();
  const { data: project } = useSuspenseQuery(projectQuery(slug));
  const { data: projects } = useSuspenseQuery(projectsQuery);
  const { data: loaded } = useSuspenseQuery(settingsQuery);
  const { data: navItems } = useSuspenseQuery(navItemsQuery);
  const settings = { ...SETTINGS_FALLBACK, ...loaded };

  if (!project) return null;

  const heroSrc = imageSrc(project.hero_image_url ?? project.cover_image_url);
  const caseStudies = projects.filter((item) => item.project_type === "case-study");
  const index = caseStudies.findIndex((item) => item.id === project.id);
  const next = caseStudies.length > 1 ? caseStudies[(index + 1) % caseStudies.length] : undefined;

  const meta: MetaRow[] = [
    ...(project.role ? [{ label: "Role", value: project.role }] : []),
    ...(project.year ? [{ label: "Year", value: project.year }] : []),
    ...(project.tools.length ? [{ label: "Tools", value: project.tools.join(", ") }] : []),
    ...project.external_links.map((link) => ({
      label: "Link",
      value: (
        <a href={link.url} target="_blank" rel="noreferrer" className="link-underline">
          {link.label || link.url} ↗
        </a>
      ),
    })),
  ];

  return (
    <>
      <Nav navItems={navItems} settings={settings} />

      <main id="main">
        <ProjectHeader
          crumb={
            <Link to="/work" className="link-underline">
              {settings["work_page_heading"]}
            </Link>
          }
          category={project.category || "Case study"}
          title={project.title}
          description={project.short_description}
          meta={meta}
        />

        {heroSrc ? (
          <Reveal className="shell">
            <div className="sheet-media overflow-hidden bg-secondary">
              <img
                src={heroSrc}
                alt={project.hero_image_alt || project.cover_image_alt || `${project.title} hero`}
                style={{ viewTransitionName: projectViewTransitionName(project.id) }}
                className="aspect-[16/9] w-full object-cover"
                decoding="async"
              />
            </div>
          </Reveal>
        ) : null}

        <div className="case-sections space-y-20 py-20 md:space-y-32 md:py-32">
          <Section label="Overview" text={project.overview} />
          <Section label="Problem" text={project.problem} />
          <Section label="Research" text={project.research} />
          <Section label="Insights" text={project.insights} />
          <Section label="Process" text={project.design_process} />
          <Section label="Decisions" text={project.design_decisions} />

          <ContentBlocks blocks={project.content_blocks} />

          <Section label="Final product" text={project.final_solution} />

          {project.gallery.length ? (
            <Reveal as="section" className="shell">
              <div className="grid gap-4 md:grid-cols-2 md:gap-6">
                {project.gallery.map((image, i) => (
                  <Figure
                    key={i}
                    image={image}
                    className={
                      project.gallery.length % 2 === 1 && i === 0 ? "md:col-span-2" : undefined
                    }
                  />
                ))}
              </div>
            </Reveal>
          ) : null}

          <Section label="Results" text={project.results} />
          <Section label="Reflection" text={project.reflection} />
        </div>

        {next ? <NextProject project={next} /> : null}
      </main>

      <Footer navItems={navItems} settings={settings} />
    </>
  );
}
