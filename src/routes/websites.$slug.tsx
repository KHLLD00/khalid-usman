import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Footer } from "@/components/site/Footer";
import { LivePreview } from "@/components/site/LivePreview";
import { Nav } from "@/components/site/Nav";
import { ProjectHeader, type MetaRow } from "@/components/site/ProjectHeader";
import { Reveal } from "@/components/site/Reveal";
import {
  navItemsQuery,
  projectQuery,
  projectsQuery,
  settingsQuery,
  SETTINGS_FALLBACK,
  type Project,
} from "@/lib/cms";

export const Route = createFileRoute("/websites/$slug")({
  loader: async ({ context, params }) => {
    const [project] = await Promise.all([
      context.queryClient.ensureQueryData(projectQuery(params.slug)),
      context.queryClient.ensureQueryData(projectsQuery),
      context.queryClient.ensureQueryData(settingsQuery),
      context.queryClient.ensureQueryData(navItemsQuery),
    ]);
    if (!project || !project.published || project.project_type !== "published-website") {
      throw notFound();
    }
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
      loaderData.description || `${loaderData.title}, a website designed by Khalid Usman.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: WebsiteDetail,
});

function NextWebsite({ project }: { project: Project }) {
  return (
    <section className="rule-top">
      <div className="shell py-20 md:py-32">
        <Link to="/websites/$slug" params={{ slug: project.slug }} className="group block">
          <p className="type-label text-muted-foreground">Next website</p>
          <h2 className="type-h1 mt-8 transition-[color,transform] duration-500 ease-editorial group-hover:translate-x-1 group-hover:text-cobalt">
            {project.title}
          </h2>
          <p className="type-meta mt-4 inline-flex items-center gap-2 text-muted-foreground">
            <span className="link-underline">View details</span>
            <span className="arrow-shift group-hover:translate-x-1 group-hover:-translate-y-1">
              ↗
            </span>
          </p>
        </Link>
      </div>
    </section>
  );
}

function WebsiteDetail() {
  const { slug } = Route.useParams();
  const { data: project } = useSuspenseQuery(projectQuery(slug));
  const { data: projects } = useSuspenseQuery(projectsQuery);
  const { data: loaded } = useSuspenseQuery(settingsQuery);
  const { data: navItems } = useSuspenseQuery(navItemsQuery);
  const settings = { ...SETTINGS_FALLBACK, ...loaded };

  if (!project) return null;

  const websites = projects.filter((item) => item.project_type === "published-website");
  const index = websites.findIndex((item) => item.id === project.id);
  const next = websites.length > 1 ? websites[(index + 1) % websites.length] : undefined;

  const meta: MetaRow[] = [
    ...(project.role ? [{ label: "Role", value: project.role }] : []),
    ...(project.year ? [{ label: "Year", value: project.year }] : []),
    ...(project.tools.length ? [{ label: "Tools", value: project.tools.join(", ") }] : []),
  ];

  return (
    <>
      <Nav navItems={navItems} settings={settings} />

      <main id="main">
        <ProjectHeader
          crumb={
            <Link to="/work" search={{ type: "websites" }} className="link-underline">
              {settings["websites_heading"]}
            </Link>
          }
          category={project.category || "Website"}
          title={project.title}
          description={project.short_description}
          cta={
            project.live_website_url ? (
              <a
                href={project.live_website_url}
                target="_blank"
                rel="noreferrer"
                className="group type-meta inline-flex items-center gap-2"
              >
                <span className="link-underline">Visit site</span>
                <span className="arrow-shift group-hover:translate-x-1 group-hover:-translate-y-1">
                  ↗
                </span>
              </a>
            ) : null
          }
          meta={meta}
        />

        <Reveal as="div" className="shell pb-20 md:pb-32">
          <div className="sheet-media">
            <LivePreview project={project} className="aspect-[16/10]" />
          </div>
        </Reveal>

        {next ? <NextWebsite project={next} /> : null}
      </main>

      <Footer navItems={navItems} settings={settings} />
    </>
  );
}
