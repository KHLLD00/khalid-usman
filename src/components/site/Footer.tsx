import type { SiteSettings } from "@/lib/cms";

export function Footer({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();

  return (
    <footer className="rule-top">
      <div className="shell grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <p className="text-sm font-medium">Khalid Usman</p>
          <p className="type-meta mt-1 text-muted-foreground">Product Designer</p>
        </div>

        <nav aria-label="Footer" className="md:col-span-4">
          <ul className="type-meta grid grid-cols-2 gap-3">
            <li>
              <a href="/#work" className="link-underline">
                Work
              </a>
            </li>
            <li>
              <a href="/#about" className="link-underline">
                About
              </a>
            </li>
            <li>
              <a href="/#contact" className="link-underline">
                Contact
              </a>
            </li>
            {settings["resume_url"] ? (
              <li>
                <a
                  href={settings["resume_url"]}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline"
                >
                  Resume
                </a>
              </li>
            ) : null}
            {settings["linkedin_url"] ? (
              <li>
                <a
                  href={settings["linkedin_url"]}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline"
                >
                  LinkedIn
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
                  Behance
                </a>
              </li>
            ) : null}
          </ul>
        </nav>

        <p className="type-meta text-muted-foreground md:col-span-3 md:text-right">
          © {year} Khalid Usman
        </p>
      </div>
    </footer>
  );
}
