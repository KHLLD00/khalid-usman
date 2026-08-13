import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { ProjectList } from "@/components/site/ProjectList";
import { Reveal } from "@/components/site/Reveal";
import { RichText } from "@/components/site/RichText";
import { projectsQuery, settingsQuery, SETTINGS_FALLBACK } from "@/lib/cms";

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

const SKILLS = [
  {
    label: "Design",
    items: [
      "Product Design",
      "UI Design",
      "UX Design",
      "Interaction Design",
      "Design Systems",
      "Prototyping",
    ],
  },
  { label: "Tools", items: ["Figma", "FigJam", "Framer", "Notion", "Principle"] },
];

function Home() {
  const { data: projects } = useSuspenseQuery(projectsQuery);
  const { data: loaded } = useSuspenseQuery(settingsQuery);
  const settings = { ...SETTINGS_FALLBACK, ...loaded };
  const featured = projects.filter((project) => project.featured);
  const shown = featured.length ? featured : projects;
  const email = settings["email"] ?? "";

  return (
    <>
      <Nav resumeUrl={settings["resume_url"] || undefined} />

      <main id="main">
        {/* Hero */}
        <section className="shell pt-40 pb-24 md:pt-56 md:pb-40">
          <Reveal>
            <p className="type-label text-muted-foreground">
              Product Design / UI/UX / Digital Experiences
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="type-display mt-8 max-w-[18ch] md:mt-12">
              I design digital products with clarity and character.
            </h1>
          </Reveal>
          <div className="mt-12 grid gap-10 md:mt-20 md:grid-cols-12 md:items-end">
            <Reveal delay={140} className="md:col-span-5 md:col-start-7">
              <p className="type-body max-w-[44ch] text-muted-foreground">
                Product designer focused on creating thoughtful digital experiences, interfaces
                and products.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-4">
                <a href="#work" className="group type-meta inline-flex items-center gap-2">
                  <span className="link-underline">View my work</span>
                  <span className="arrow-shift group-hover:translate-y-0.5">↓</span>
                </a>
                <a href="#contact" className="group type-meta inline-flex items-center gap-2">
                  <span className="link-underline">Let&apos;s talk</span>
                  <span className="arrow-shift group-hover:translate-x-1 group-hover:-translate-y-1">
                    ↗
                  </span>
                </a>
              </div>
            </Reveal>
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
                <p className="type-h1 max-w-[30ch]">
                  I&apos;m Khalid Usman, a product designer interested in making digital products
                  clearer, more useful and more human.
                </p>
              </Reveal>
              <Reveal delay={80} className="mt-10">
                <RichText text={settings["about_paragraph"]} />
              </Reveal>

              <div className="mt-16 grid gap-10 sm:grid-cols-2 md:mt-24">
                {SKILLS.map((group, index) => (
                  <Reveal key={group.label} delay={index * 80}>
                    <h3 className="type-label border-t pt-6 text-muted-foreground">
                      {group.label}
                    </h3>
                    <ul className="type-small mt-5 space-y-2">
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="rule-top scroll-mt-24">
          <div className="shell py-24 md:py-40">
            <Reveal>
              <h2 className="type-display max-w-[16ch]">Let&apos;s make something worth using.</h2>
            </Reveal>
            <div className="mt-12 grid gap-10 md:mt-20 md:grid-cols-12 md:items-end">
              <Reveal className="md:col-span-6">
                {email ? (
                  <a
                    href={`mailto:${email}`}
                    className="group type-h3 inline-flex items-center gap-3"
                  >
                    <span className="link-underline">Get in touch</span>
                    <span className="arrow-shift group-hover:translate-x-1 group-hover:-translate-y-1">
                      ↗
                    </span>
                  </a>
                ) : null}
                {email ? (
                  <p className="type-body mt-6 text-muted-foreground">{email}</p>
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
                </ul>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </>
  );
}
