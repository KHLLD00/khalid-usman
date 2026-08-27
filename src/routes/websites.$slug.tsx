import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Footer } from "@/components/site/Footer";
import { LivePreview } from "@/components/site/LivePreview";
import { Nav } from "@/components/site/Nav";
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
        meta: [{ title: "Unavailable — Khalid Usman" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.title} — Khalid Usman`;
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
          <h2 className="type-h1 mt-8 transition-transform duration-500 ease-editorial group-hover:translate-x-1">
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

  return (
    <>
      <Nav navItems={navItems} resumeUrl={settings["resume_url"] || undefined} />

      <main id="main">
        <header className="shell pt-32 pb-12 md:pt-48 md:pb-20">
          <Reveal>
            <p className="type-label text-muted-foreground">
              <Link to="/" hash="websites" className="link-underline">
                Published Websites
              </Link>
              <span className="mx-3">/</span>
              {project.category || "Website"}
            </p>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="type-display mt-8 max-w-[18ch] md:mt-12">{project.title}</h1>
          </Reveal>
          <div className="mt-12 grid gap-10 md:mt-20 md:grid-cols-12">
            <Reveal className="md:col-span-5">
              <p className="type-body max-w-[44ch] text-muted-foreground">
                {project.short_description}
              </p>
            </Reveal>
            <Reveal delay={80} className="md:col-span-4 md:col-start-9">
              <dl className="type-meta grid grid-cols-2 gap-y-4 md:grid-cols-1">
                {project.role ? (
                  <div className="border-t pt-3">
                    <dt className="text-muted-foreground">Role</dt>
                    <dd className="mt-1">{project.role}</dd>
                  </div>
                ) : null}
                {project.year ? (
                  <div className="border-t pt-3">
                    <dt className="text-muted-foreground">Year</dt>
                    <dd className="mt-1">{project.year}</dd>
                  </div>
                ) : null}
                {project.tools.length ? (
                  <div className="col-span-2 border-t pt-3 md:col-span-1">
                    <dt className="text-muted-foreground">Tools</dt>
                    <dd className="mt-1">{project.tools.join(", ")}</dd>
                  </div>
                ) : null}
                {project.live_website_url ? (
                  <div className="col-span-2 border-t pt-3 md:col-span-1">
                    <dt className="text-muted-foreground">Website</dt>
                    <dd className="mt-1">
                      <a
                        href={project.live_website_url}
                        target="_blank"
                        rel="noreferrer"
                        className="link-underline"
                      >
                        Visit site ↗
                      </a>
                    </dd>
                  </div>
                ) : null}
              </dl>
            </Reveal>
          </div>
        </header>

        <Reveal as="div" className="shell">
          <LivePreview project={project} className="aspect-[16/10]" />
        </Reveal>

        {next ? <NextWebsite project={next} /> : null}
      </main>

      <Footer navItems={navItems} settings={settings} />
    </>
  );
}
