import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export function Nav({ resumeUrl }: { resumeUrl?: string | undefined }) {
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
        <Link
          to="/"
          className="text-sm font-medium tracking-tight"
          onClick={() => setOpen(false)}
        >
          Khalid Usman
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-10 md:flex">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="link-underline type-meta">
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
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="type-h2"
                onClick={() => setOpen(false)}
              >
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
