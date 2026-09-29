import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { ProjectSheets } from "@/components/site/ProjectSheet";
import { navItemsQuery, projectsQuery, settingsQuery, SETTINGS_FALLBACK } from "@/lib/cms";
import { cn, stagger } from "@/lib/utils";

type WorkFilter = "ui-ux" | "websites";

const TITLE = "Work | Khalid Usman";
const DESCRIPTION =
  "The complete portfolio of Khalid Usman: UI/UX case studies and published websites.";

export const Route = createFileRoute("/work/")({
  validateSearch: (search: Record<string, unknown>): { type?: WorkFilter } =>
    search["type"] === "ui-ux" || search["type"] === "websites" ? { type: search["type"] } : {},
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(projectsQuery),
      context.queryClient.ensureQueryData(settingsQuery),
      context.queryClient.ensureQueryData(navItemsQuery),
    ]);
  },
  component: WorkPage,
});

function WorkPage() {
  const { data: projects } = useSuspenseQuery(projectsQuery);
  const { data: loaded } = useSuspenseQuery(settingsQuery);
  const { data: navItems } = useSuspenseQuery(navItemsQuery);
  const { type } = Route.useSearch();
  const settings = { ...SETTINGS_FALLBACK, ...loaded };

  const caseStudies = projects.filter((project) => project.project_type === "case-study");
  const websites = projects.filter((project) => project.project_type === "published-website");
  const visible = type === "ui-ux" ? caseStudies : type === "websites" ? websites : projects;

  const filters = [
    { label: "All Work", count: projects.length, active: !type, search: {} },
    {
      label: "UI/UX",
      count: caseStudies.length,
      active: type === "ui-ux",
      search: { type: "ui-ux" as const },
    },
    {
      label: "Websites",
      count: websites.length,
      active: type === "websites",
      search: { type: "websites" as const },
    },
  ];

  return (
    <>
      <Nav navItems={navItems} settings={settings} />

      <main id="main" className="paper-lines">
        <section className="shell pb-16 pt-32 md:pb-24 md:pt-48">
          <div
            className="hero-in flex items-baseline justify-between gap-6 border-b pb-4"
            style={stagger(0)}
          >
            <p className="type-label text-muted-foreground">{settings["work_page_heading"]}</p>
            <span className="page-no type-label text-muted-foreground" aria-hidden />
          </div>
          <h1 className="type-display hero-in mt-10 md:mt-16" style={stagger(1)}>
            {settings["work_page_heading"]}
          </h1>
          {settings["work_page_description"] ? (
            <p
              className="type-body hero-in mt-8 max-w-[44ch] text-muted-foreground"
              style={stagger(2)}
            >
              {settings["work_page_description"]}
            </p>
          ) : null}

          <nav
            aria-label="Filter work"
            className="hero-in -mx-6 mt-12 overflow-x-auto px-6 [scrollbar-width:none] md:mx-0 md:mt-16 md:px-0"
            style={stagger(3)}
          >
            <ul className="flex gap-8 whitespace-nowrap">
              {filters.map((filter) => (
                <li key={filter.label}>
                  <Link
                    to="/work"
                    search={filter.search}
                    replace
                    resetScroll={false}
                    aria-current={filter.active ? "true" : undefined}
                    className={cn(
                      "type-meta -mb-px inline-flex items-baseline gap-2 border-b pb-2 transition-colors duration-300",
                      filter.active
                        ? "border-cobalt text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {filter.label}
                    <span className="type-label">{filter.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </section>

        <section className="shell pb-24 md:pb-40">
          <div key={type ?? "all"}>
            <ProjectSheets projects={visible} empty="Nothing here yet." />
          </div>
        </section>
      </main>

      <Footer navItems={navItems} settings={settings} />
    </>
  );
}
