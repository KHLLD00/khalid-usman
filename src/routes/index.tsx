import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { CSSProperties } from "react";

import { Annotation } from "@/components/site/Annotation";
import { CopyButton } from "@/components/site/CopyButton";
import { ExperimentsList } from "@/components/site/ExperimentsList";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { ProjectSheets } from "@/components/site/ProjectSheet";
import { Reveal } from "@/components/site/Reveal";
import { RichText } from "@/components/site/RichText";
import { ToolkitTicker } from "@/components/site/ToolkitTicker";
import {
  experimentsQuery,
  imageSrc,
  navItemsQuery,
  parseEntries,
  parseList,
  projectsQuery,
  settingsQuery,
  SETTINGS_FALLBACK,
  toolkitItemsQuery,
} from "@/lib/cms";
import { cn, pad, stagger } from "@/lib/utils";

const TITLE = "Khalid Usman | UI/UX Designer & Web Designer";
const DESCRIPTION =
  "UI/UX and web designer creating thoughtful, responsive digital experiences. Selected work, case studies and design thinking.";

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

function SectionHead({ title, aside, note }: { title: string; aside?: string; note?: string }) {
  return (
    <div className="mb-12 md:mb-20">
      <Reveal className="flex items-baseline justify-between gap-6">
        <h2 className="type-h2">{title}</h2>
        <span className="type-label flex gap-4 text-muted-foreground">
          {aside ? <span>{aside}</span> : null}
          <span className="page-no" aria-hidden />
        </span>
      </Reveal>
      <Annotation text={note} arrow delay={200} className="mt-3" />
    </div>
  );
}

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
  const portrait = imageSrc(settings["hero_image_url"]);
  const capabilities = parseList(settings["intro_capabilities"]);
  const services = parseEntries(settings["services_list"]);
  const steps = parseEntries(settings["process_steps"]);

  return (
    <>
      <Nav navItems={navItems} settings={settings} />

      <main id="main" className="paper-lines">
        {/* Hero */}
        <section className="shell pb-24 pt-32 md:pb-40 md:pt-48">
          <div
            className="hero-in flex items-baseline justify-between gap-6 border-b pb-4"
            style={stagger(0)}
          >
            <p className="type-label text-muted-foreground">{settings["hero_eyebrow"]}</p>
            <span className="page-no type-label text-muted-foreground" aria-hidden />
          </div>
          <h1 className="type-display hero-in mt-10 max-w-[16ch] md:mt-16" style={stagger(1)}>
            {settings["hero_headline"]}
          </h1>
          <div className="mt-10 grid gap-10 md:mt-16 md:grid-cols-12 md:items-end">
            <div className="hero-in md:col-span-7" style={stagger(2)}>
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
            </div>
            <Annotation
              text={settings["hero_note"]}
              arrow
              delay={700}
              className="md:col-span-4 md:col-start-9"
            />
          </div>
        </section>

        {/* Introduction */}
        {settings["intro_heading"] ? (
          <section className="rule-top">
            <div className="shell grid gap-12 py-24 md:grid-cols-12 md:py-40">
              <Reveal className="md:col-span-3">
                <span className="page-no type-label text-muted-foreground" aria-hidden />
              </Reveal>
              <div className="md:col-span-9">
                <Reveal>
                  <p className="type-h1 max-w-[26ch]">{settings["intro_heading"]}</p>
                </Reveal>
                {capabilities.length ? (
                  <Reveal delay={80}>
                    <ul className="mt-12 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 md:mt-16">
                      {capabilities.map((capability) => (
                        <li key={capability} className="type-meta border-t pt-3">
                          {capability}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        {/* Selected work */}
        <section id="work" className="shell scroll-mt-24 pb-24 md:pb-40">
          <SectionHead
            title={settings["work_heading"] ?? ""}
            aside={`${pad(shown.length)} Projects`}
            note={settings["work_note"] ?? ""}
          />
          <ProjectSheets
            projects={shown}
            empty="No projects published yet. Sign in to the studio to add the first case study."
          />
        </section>

        {/* Published websites */}
        {publishedWebsites.length ? (
          <section id="websites" className="shell scroll-mt-24 pb-24 md:pb-40">
            <SectionHead title={settings["websites_heading"] ?? ""} />
            {settings["websites_description"] ? (
              <Reveal className="-mt-8 mb-12 md:-mt-14 md:mb-20">
                <p className="type-body max-w-[46ch] text-muted-foreground">
                  {settings["websites_description"]}
                </p>
              </Reveal>
            ) : null}
            <ProjectSheets projects={publishedWebsites} />
          </section>
        ) : null}

        {/* View all work */}
        {settings["work_view_all_text"] ? (
          <section className="shell pb-24 md:pb-40">
            <Reveal className="rule-top pt-10">
              <a
                href={settings["work_view_all_url"] || "/work"}
                className="group type-h2 inline-flex items-center gap-4"
              >
                <span className="link-underline">{settings["work_view_all_text"]}</span>
                <span className="arrow-shift group-hover:translate-x-1 group-hover:-translate-y-1">
                  ↗
                </span>
              </a>
            </Reveal>
          </section>
        ) : null}

        {/* Toolkit ticker */}
        <ToolkitTicker items={toolkitItems} />

        {/* What I do */}
        {services.length ? (
          <section className="rule-top">
            <div className="shell py-24 md:py-40">
              <SectionHead title={settings["services_heading"] ?? ""} />
              <dl className="grid gap-12 sm:grid-cols-2 md:gap-10 lg:grid-cols-4">
                {services.map((service, index) => (
                  <Reveal key={service.title} delay={index * 80}>
                    <dt className="border-t pt-6">
                      <span className="type-label text-cobalt">{pad(index + 1)}</span>
                      <span className="type-serif mt-4 block text-3xl leading-tight">
                        {service.title}
                      </span>
                    </dt>
                    <dd className="type-small mt-4 max-w-[34ch] text-muted-foreground">
                      {service.body}
                    </dd>
                  </Reveal>
                ))}
              </dl>
            </div>
          </section>
        ) : null}

        {/* Designer's note */}
        <section id="about" className="shell scroll-mt-24 pb-24 md:pb-40">
          <Reveal as="article" className="sheet relative border bg-card p-6 md:p-12">
            <div className="grid gap-12 md:grid-cols-12 md:gap-10">
              <div className={portrait ? "md:col-span-7" : "md:col-span-12"}>
                <p className="type-label flex justify-between gap-6 text-muted-foreground">
                  <span>{settings["about_label"]}</span>
                  <span className="page-no" aria-hidden />
                </p>
                <p className="type-h1 mt-8 max-w-[26ch]">{settings["about_heading"]}</p>
                <RichText text={settings["about_paragraph"]} className="mt-8" />
                {portrait ? null : (
                  <Annotation text={settings["about_note"]} arrow className="mt-8" />
                )}
              </div>
              {portrait ? (
                <div className="md:col-span-5">
                  <div className="border bg-card p-2 shadow-[0_18px_36px_-24px_oklch(0_0_0/35%)]">
                    <img
                      src={portrait}
                      alt={settings["hero_image_alt"] || "Portrait of Khalid Usman"}
                      className="aspect-[4/5] w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <Annotation text={settings["about_note"]} arrow className="mt-5" />
                </div>
              ) : null}
            </div>
          </Reveal>
        </section>

        {/* How I design */}
        {steps.length ? (
          <section className="rule-top">
            <div className="shell py-24 md:py-40">
              <SectionHead
                title={settings["process_heading"] ?? ""}
                note={settings["process_note"] ?? ""}
              />
              <Reveal className="relative">
                <div aria-hidden className="process-line hidden md:block" />
                <ol
                  className="grid gap-10 md:gap-6 md:[grid-template-columns:repeat(var(--n),minmax(0,1fr))]"
                  style={{ "--n": steps.length } as CSSProperties}
                >
                  {steps.map((step, index) => (
                    <li
                      key={step.title}
                      style={stagger(index)}
                      className="process-step relative border-l pl-6 md:border-l-0 md:pl-0 md:pt-8"
                    >
                      <span
                        aria-hidden
                        className="absolute -left-[4.5px] top-1 size-2 rounded-full bg-cobalt md:left-0 md:top-0"
                      />
                      <p className="type-label text-cobalt">{pad(index + 1)}</p>
                      <h3 className="type-serif mt-4 text-3xl leading-tight">{step.title}</h3>
                      <p className="type-small mt-3 max-w-[30ch] text-muted-foreground">
                        {step.body}
                      </p>
                    </li>
                  ))}
                </ol>
              </Reveal>
            </div>
          </section>
        ) : null}

        {/* Experiments */}
        {experiments.length ? (
          <section id="experiments" className="rule-top scroll-mt-24">
            <div className="shell py-24 md:py-40">
              <SectionHead
                title={settings["experiments_heading"] ?? ""}
                aside={pad(experiments.length)}
              />
              <ExperimentsList experiments={experiments} />
            </div>
          </section>
        ) : null}

        {/* Contact */}
        <section id="contact" className="rule-top scroll-mt-24">
          <div className="shell py-24 md:py-40">
            <Reveal className="mb-10 flex justify-end">
              <span className="page-no type-label text-muted-foreground" aria-hidden />
            </Reveal>
            <Reveal>
              <h2 className="type-display max-w-[16ch]">{settings["contact_heading"]}</h2>
            </Reveal>
            <Annotation text={settings["contact_note"]} arrow delay={200} className="mt-6" />

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
