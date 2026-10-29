import { Link, useLocation } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";

import type { NavItem, SiteSettings } from "@/lib/cms";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";
const THEME_STORAGE_KEY = "khalid-portfolio-theme";

const FALLBACK_LINKS: NavItem[] = [
  { id: "work", label: "Work", url: "/#work", sort_order: 0, visible: true },
  { id: "about", label: "About", url: "/#about", sort_order: 1, visible: true },
  { id: "contact", label: "Contact", url: "/#contact", sort_order: 2, visible: true },
];

const HOME_LINK: NavItem = { id: "home", label: "Home", url: "/", sort_order: -1, visible: true };

const SOCIALS = [
  { key: "linkedin_url", label: "LinkedIn" },
  { key: "behance_url", label: "Behance" },
  { key: "x_url", label: "X" },
  { key: "instagram_url", label: "Instagram" },
] as const;

function isActive(url: string, pathname: string, hash: string) {
  const [rawPath = "", rawHash = ""] = url.split("#");
  const path = rawPath || "/";
  if (rawHash) return pathname === path && hash === rawHash;
  if (path === "/") return pathname === "/" && !hash;
  return pathname === path || pathname.startsWith(`${path}/`);
}

function HandUnderline() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 8"
      preserveAspectRatio="none"
      className="hand-underline pointer-events-none absolute inset-x-0 -bottom-1 h-2 w-full overflow-visible text-cobalt"
    >
      <path
        d="M2 5.5C22 2.5 45 6.5 68 3.8S104 4.6 118 3"
        pathLength={1}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </svg>
  );
}

function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const Icon = theme === "dark" ? Sun : Moon;
  const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      title={label}
      className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-transparent transition-colors hover:border-border hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
    >
      <Icon aria-hidden="true" size={18} strokeWidth={1.7} />
    </button>
  );
}

export function Nav({
  navItems,
  settings,
}: {
  navItems?: NavItem[] | undefined;
  settings?: SiteSettings | undefined;
}) {
  const links = navItems && navItems.length ? navItems : FALLBACK_LINKS;
  const menuLinks = links.some((link) => link.url === "/") ? links : [HOME_LINK, ...links];
  const resumeUrl = settings?.["resume_url"];
  const socials = SOCIALS.map(({ key, label }) => ({ label, url: settings?.[key] ?? "" })).filter(
    (social) => social.url,
  );
  const pathname = useLocation({ select: (location) => location.pathname });
  const hash = useLocation({ select: (location) => location.hash });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme: Theme =
      savedTheme === "light" || savedTheme === "dark"
        ? savedTheme
        : systemPrefersDark
          ? "dark"
          : "light";

    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
    document.documentElement.style.colorScheme = initialTheme;
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.style.colorScheme = nextTheme;
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const desktop = window.matchMedia("(min-width: 768px)");
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onBreakpoint = () => {
      if (desktop.matches) setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b border-transparent transition-colors duration-300",
          scrolled && !open && "border-border bg-background/85 backdrop-blur-md",
        )}
      >
        <div className="shell flex h-16 items-center justify-between md:h-20">
          <Link to="/" className="type-serif text-2xl leading-none" onClick={() => setOpen(false)}>
            Khalid Usman
          </Link>

          <div className="flex items-center gap-2">
            <nav aria-label="Primary" className="hidden items-center gap-10 md:flex">
              {links.map((link) => (
                <a key={link.id} href={link.url} className="link-underline type-meta">
                  {link.label}
                </a>
              ))}
              {resumeUrl ? (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline type-meta"
                >
                  Resume
                </a>
              ) : null}
            </nav>
            <div className="hidden md:block">
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
            </div>

            <div className="flex items-center md:hidden">
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
              <button
                type="button"
                className="-mr-2.5 flex size-11 items-center justify-center"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                aria-controls="mobile-menu"
                onClick={() => setOpen((value) => !value)}
              >
                <span aria-hidden className="relative block h-3.5 w-6">
                  <span
                    className={cn(
                      "absolute inset-x-0 h-[1.5px] bg-foreground transition-[top,transform] duration-500 ease-editorial",
                      open ? "top-[6.25px] rotate-45" : "top-0",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute inset-x-0 top-[6.25px] h-[1.5px] bg-foreground transition-opacity duration-300",
                      open && "opacity-0",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute inset-x-0 h-[1.5px] bg-foreground transition-[top,transform] duration-500 ease-editorial",
                      open ? "top-[6.25px] -rotate-45" : "top-[12.5px]",
                    )}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        data-open={open}
        inert={!open}
        className="nb-menu fixed inset-0 z-40 overflow-y-auto overscroll-contain bg-background md:hidden"
      >
        <nav aria-label="Mobile" className="shell flex min-h-full flex-col pb-10 pt-24">
          <ol className="border-b">
            {menuLinks.map((link, index) => {
              const active = isActive(link.url, pathname, hash);
              return (
                <li
                  key={link.id}
                  className="nb-menu-item border-t"
                  style={{ "--i": index } as CSSProperties}
                >
                  <a
                    href={link.url}
                    aria-current={active ? "page" : undefined}
                    className="flex items-baseline gap-5 py-5"
                    onClick={() => setOpen(false)}
                  >
                    <span className="type-label w-6 text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="type-h1 relative inline-block">
                      {link.label}
                      {active ? <HandUnderline /> : null}
                    </span>
                  </a>
                </li>
              );
            })}
            {resumeUrl ? (
              <li
                className="nb-menu-item border-t"
                style={{ "--i": menuLinks.length } as CSSProperties}
              >
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-baseline gap-5 py-5"
                >
                  <span className="type-label w-6 text-muted-foreground">
                    {String(menuLinks.length + 1).padStart(2, "0")}
                  </span>
                  <span className="type-h1">Resume ↗</span>
                </a>
              </li>
            ) : null}
          </ol>

          <div className="nb-menu-item flex items-center justify-between border-t py-4" style={{ "--i": menuLinks.length + 1 } as CSSProperties}>
            <span className="type-meta text-muted-foreground">Appearance</span>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>

          {socials.length ? (
            <ul
              className="nb-menu-item type-meta mt-auto flex flex-wrap gap-x-6 gap-y-3 pt-12"
              style={{ "--i": menuLinks.length + 2 } as CSSProperties}
            >
              {socials.map((social) => (
                <li key={social.label}>
                  <a href={social.url} target="_blank" rel="noreferrer" className="link-underline">
                    {social.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </nav>
      </div>
    </>
  );
}
