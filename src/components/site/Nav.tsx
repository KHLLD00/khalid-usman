import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import type { NavItem } from "@/lib/cms";
import { cn } from "@/lib/utils";

const FALLBACK_LINKS: NavItem[] = [
  { id: "work", label: "Work", url: "/#work", sort_order: 0, visible: true },
  { id: "about", label: "About", url: "/#about", sort_order: 1, visible: true },
  { id: "contact", label: "Contact", url: "/#contact", sort_order: 2, visible: true },
];

export function Nav({
  navItems,
  resumeUrl,
}: {
  navItems?: NavItem[] | undefined;
  resumeUrl?: string | undefined;
}) {
  const links = navItems && navItems.length ? navItems : FALLBACK_LINKS;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        scrolled && "border-b bg-background/85 backdrop-blur-md",
      )}
    >
      <div className="shell flex h-16 items-center justify-between md:h-20">
        <Link to="/" className="text-sm font-medium tracking-tight" onClick={() => setOpen(false)}>
          Khalid Usman
        </Link>

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

        <button
          type="button"
          className="type-label md:hidden"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 top-16 bg-background md:hidden">
          <nav aria-label="Mobile" className="shell flex flex-col gap-8 pt-16">
            {links.map((link) => (
              <a key={link.id} href={link.url} className="type-h2" onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
            {resumeUrl ? (
              <a href={resumeUrl} target="_blank" rel="noreferrer" className="type-h2">
                Resume
              </a>
            ) : null}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
