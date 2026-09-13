import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { CopyButton } from "@/components/site/CopyButton";
import { ExperimentsList } from "@/components/site/ExperimentsList";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { ProjectList } from "@/components/site/ProjectList";
import { PublishedWebsiteList } from "@/components/site/PublishedWebsiteList";
import { Reveal } from "@/components/site/Reveal";
import { RichText } from "@/components/site/RichText";
import { ToolkitTicker } from "@/components/site/ToolkitTicker";
import {
  experimentsQuery,
  imageSrc,
  navItemsQuery,
  projectsQuery,
  settingsQuery,
  SETTINGS_FALLBACK,
  toolkitItemsQuery,
} from "@/lib/cms";
import { cn } from "@/lib/utils";

const TITLE = "Khalid Usman — Product Designer";
const DESCRIPTION =
  "Product designer focused on creating thoughtful digital experiences, interfaces and products. Selected work, case studies and design thinking.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(projectsQuery),
      context.queryClient.ensureQueryData(settingsQuery),
      context.queryClient.ensureQueryData(navItemsQuery),
      context.queryClient.ensureQueryData(toolkitItemsQuery),
      context.queryClient.ensureQueryData(experimentsQuery),
    ]);
  },
  component: Home,
});

const PRINCIPLES = [
  {
    title: "Clarity",
    body: "Interfaces should make complicated things easier to understand.",
  },
  { title: "Intent", body: "Every element should have a reason to exist." },
  { title: "Character", body: "Useful products can still have personality." },
];

function Home() {
  const { data: projects } = useSuspenseQuery(projectsQuery);
  const { data: loaded } = useSuspenseQuery(settingsQuery);
  const { data: navItems } = useSuspenseQuery(navItemsQuery);
  const { data: toolkitItems } = useSuspenseQuery(toolkitItemsQuery);
  const { data: experiments } = useSuspenseQuery(experimentsQuery);
  const settings = { ...SETTINGS_FALLBACK, ...loaded };
  const caseStudies = projects.filter((project) => project.project_type === "case-study");
  const publishedWebsites = projects.filter(
    (project) => project.project_type === "published-website",
  );
  const featured = caseStudies.filter((project) => project.featured);
  const shown = featured.length ? featured : caseStudies;
  const email = settings["email"] ?? "";
  const whatsappUrl = settings["whatsapp_url"] ?? "";
  const availabilityLabel = settings["availability_label"] ?? "";
  const availabilityOpen = settings["availability_open"] === "true";
  const skills = (settings["contact_skills"] ?? "")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
  const heroImage = imageSrc(settings["hero_image_url"]);

  return (
    <>
      <Nav navItems={navItems} resumeUrl={settings["resume_url"] || undefined} />

      <main id="main">
        {/* Hero */}
        <section className="shell pt-40 pb-24 md:pt-56 md:pb-40">
          <div className="grid gap-16 md:grid-cols-12 md:items-center">
            <div className={heroImage ? "md:col-span-7" : "md:col-span-12"}>
              <Reveal immediate>
                <p className="type-label text-muted-foreground">{settings["hero_eyebrow"]}</p>
              </Reveal>
              <Reveal immediate>
                <h1 className="type-display mt-8 max-w-[18ch] md:mt-12">
                  {settings["hero_headline"]}
                </h1>
              </Reveal>
              <Reveal immediate className="mt-10 md:mt-16">
                <p className="type-body max-w-[44ch] text-muted-foreground">
                  {settings["hero_description"]}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                  {settings["primary_cta_text"] ? (
                    <a href={settings["primary_cta_url"] || "#work"} className="btn-primary">
                      {settings["primary_cta_text"]}
                    </a>
                  ) : null}
                  {settings["secondary_cta_text"] ? (
                    <a
                      href={settings["secondary_cta_url"] || "#contact"}
                      className="group type-meta inline-flex items-center gap-2"
                    >
                      <span className="link-underline">{settings["secondary_cta_text"]}</span>
                      <span className="arrow-shift group-hover:translate-x-1 group-hover:-translate-y-1">
                        ↗
                      </span>
                    </a>
                  ) : null}
                </div>
              </Reveal>
            </div>

            {heroImage ? (
              <Reveal immediate className="md:col-span-5">
                <div className="overflow-hidden bg-secondary">
                  <img
                    src={heroImage}
                    alt={settings["hero_image_alt"] || "Portrait of Khalid Usman"}
                    className="aspect-[4/5] w-full object-cover"
                    decoding="async"
                  />
                </div>
              </Reveal>
            ) : null}
          </div>
        </section>

        {/* Selected work */}
        <section id="work" className="shell scroll-mt-24 pb-24 md:pb-40">
          <Reveal className="mb-12 flex items-baseline justify-between md:mb-20">
            <h2 className="type-h2">Selected Work</h2>
            <span className="type-label text-muted-foreground">
              {String(shown.length).padStart(2, "0")} Projects
            </span>
          </Reveal>
          <ProjectList projects={shown} />
        </section>

        {/* Published websites */}
        {publishedWebsites.length ? (
          <section id="websites" className="shell scroll-mt-24 pb-24 md:pb-40">
            <Reveal className="mb-6 md:mb-8">
              <h2 className="type-h2">Published Websites</h2>
            </Reveal>
            <Reveal delay={40} className="mb-12 md:mb-20">
              <p className="type-body max-w-[46ch] text-muted-foreground">
                Web experiences I've designed and brought to life.
              </p>
            </Reveal>
            <PublishedWebsiteList projects={publishedWebsites} />
          </section>
        ) : null}

        {/* Toolkit ticker */}
        <ToolkitTicker items={toolkitItems} />

        {/* Philosophy */}
        <section className="rule-top">
          <div className="shell py-24 md:py-40">
            <Reveal>
              <h2 className="type-h2">How I think</h2>
            </Reveal>
            <dl className="mt-12 grid gap-12 md:mt-20 md:grid-cols-3 md:gap-16">
              {PRINCIPLES.map((principle, index) => (
                <Reveal key={principle.title} delay={index * 80}>
                  <dt className="type-h3 border-t pt-6">{principle.title}</dt>
                  <dd className="type-body mt-4 max-w-[34ch] text-muted-foreground">
                    {principle.body}
                  </dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </section>

        {/* About */}
        <section id="about" className="rule-top scroll-mt-24">
          <div className="shell grid gap-12 py-24 md:grid-cols-12 md:py-40">
            <Reveal className="md:col-span-3">
              <h2 className="type-label text-muted-foreground">About</h2>
            </Reveal>
            <div className="md:col-span-9">
              <Reveal>
                <p className="type-h1 max-w-[30ch]">{settings["about_heading"]}</p>
              </Reveal>
              <Reveal delay={80} className="mt-10">
                <RichText text={settings["about_paragraph"]} />
              </Reveal>
            </div>
          </div>
        </section>

        {/* Experiments */}
        {experiments.length ? (
          <section id="experiments" className="rule-top scroll-mt-24">
            <div className="shell py-24 md:py-40">
              <Reveal className="mb-12 flex items-baseline justify-between md:mb-16">
                <h2 className="type-h2">Experiments</h2>
                <span className="type-label text-muted-foreground">
                  {String(experiments.length).padStart(2, "0")}
                </span>
              </Reveal>
              <ExperimentsList experiments={experiments} />
            </div>
          </section>
        ) : null}

        {/* Contact */}
        <section id="contact" className="rule-top scroll-mt-24">
          <div className="shell py-24 md:py-40">
            <Reveal>
              <h2 className="type-display max-w-[16ch]">{settings["contact_heading"]}</h2>
            </Reveal>

            {availabilityLabel || skills.length ? (
              <Reveal delay={40} className="mt-8 flex flex-wrap items-center gap-3">
                {availabilityLabel ? (
                  <span className="type-meta inline-flex items-center gap-2 border px-3 py-1.5">
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        availabilityOpen ? "bg-emerald-500" : "bg-muted-foreground",
                      )}
                    />
                    {availabilityLabel}
                  </span>
                ) : null}
                {skills.map((skill) => (
                  <span key={skill} className="type-meta border px-3 py-1.5 text-muted-foreground">
                    {skill}
                  </span>
                ))}
              </Reveal>
            ) : null}

            <div className="mt-12 grid gap-10 md:mt-20 md:grid-cols-12 md:items-end">
              <Reveal className="md:col-span-7">
                {email ? (
                  <>
                    <p className="type-meta text-muted-foreground">Get in touch</p>
                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      <a
                        href={`mailto:${email}`}
                        className="group type-h1 inline-flex items-center gap-3 break-all"
                      >
                        <span className="link-underline">{email}</span>
                        <span className="arrow-shift shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1">
                          ↗
                        </span>
                      </a>
                      <CopyButton value={email} label="Copy email" />
                    </div>
                  </>
                ) : null}
                {whatsappUrl ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      "group type-h3 inline-flex items-center gap-3",
                      email ? "mt-8" : "",
                    )}
                  >
                    <span className="link-underline">Message on WhatsApp</span>
                    <span className="arrow-shift group-hover:translate-x-1 group-hover:-translate-y-1">
                      ↗
                    </span>
                  </a>
                ) : null}
              </Reveal>
              <Reveal delay={80} className="md:col-span-4 md:col-start-9">
                <ul className="type-meta space-y-3">
                  {settings["linkedin_url"] ? (
                    <li>
                      <a
                        href={settings["linkedin_url"]}
                        target="_blank"
                        rel="noreferrer"
                        className="link-underline"
                      >
                        LinkedIn ↗
                      </a>
                    </li>
                  ) : null}
                  {settings["behance_url"] ? (
                    <li>
                      <a
                        href={settings["behance_url"]}
                        target="_blank"
                        rel="noreferrer"
                        className="link-underline"
                      >
                        Behance ↗
                      </a>
                    </li>
                  ) : null}
                  {settings["x_url"] ? (
                    <li>
                      <a
                        href={settings["x_url"]}
                        target="_blank"
                        rel="noreferrer"
                        className="link-underline"
                      >
                        X ↗
                      </a>
                    </li>
                  ) : null}
                  {settings["instagram_url"] ? (
                    <li>
                      <a
                        href={settings["instagram_url"]}
                        target="_blank"
                        rel="noreferrer"
                        className="link-underline"
                      >
                        Instagram ↗
                      </a>
                    </li>
                  ) : null}
                </ul>
                {settings["response_time_note"] ? (
                  <p className="type-meta mt-6 text-muted-foreground">
                    {settings["response_time_note"]}
                  </p>
                ) : null}
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <Footer navItems={navItems} settings={settings} />
    </>
  );
}
