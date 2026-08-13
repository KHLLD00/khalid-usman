import type { NavItem, SiteSettings } from "@/lib/cms";

const FALLBACK_LINKS: NavItem[] = [
  { id: "work", label: "Work", url: "/#work", sort_order: 0, visible: true },
  { id: "about", label: "About", url: "/#about", sort_order: 1, visible: true },
  { id: "contact", label: "Contact", url: "/#contact", sort_order: 2, visible: true },
];

export function Footer({
  navItems,
  settings,
}: {
  navItems?: NavItem[] | undefined;
  settings: SiteSettings;
}) {
  const year = new Date().getFullYear();
  const links = navItems && navItems.length ? navItems : FALLBACK_LINKS;
  const email = settings["email"] ?? "";

  return (
    <footer>
      {settings["footer_headline"] ? (
        <div className="shell rule-top py-20 md:py-32">
          <h2 className="type-display max-w-[18ch]">{settings["footer_headline"]}</h2>
          {settings["footer_description"] ? (
            <p className="type-body mt-6 max-w-[46ch] text-muted-foreground">
              {settings["footer_description"]}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="shell grid gap-12 rule-top py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <p className="text-sm font-medium">Khalid Usman</p>
          <p className="type-meta mt-1 text-muted-foreground">Product Designer</p>
          {email ? (
            <a href={`mailto:${email}`} className="type-meta link-underline mt-3 inline-block">
              {email}
            </a>
          ) : null}
        </div>

        <nav aria-label="Footer" className="md:col-span-4">
          <ul className="type-meta grid grid-cols-2 gap-3">
            {links.map((link) => (
              <li key={link.id}>
                <a href={link.url} className="link-underline">
                  {link.label}
                </a>
              </li>
            ))}
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
            {settings["x_url"] ? (
              <li>
                <a
                  href={settings["x_url"]}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline"
                >
                  X
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
                  Instagram
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
