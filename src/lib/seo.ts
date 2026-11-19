export const SITE_URL = "https://khalid-usman.vercel.app";
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export function canonicalUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export function jsonLdScript(data: Record<string, unknown>) {
  return {
    type: "application/ld+json",
    children: JSON.stringify(data).replace(/</g, "\\u003c"),
  };
}

export const PERSON_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Khalid Usman Adinoyi",
  alternateName: ["Khalid Usman"],
  url: SITE_URL,
  jobTitle: ["UI/UX Designer", "Web Designer", "Product Designer"],
  description: "Khalid Usman Adinoyi is a Nigerian UI/UX designer and web designer creating intuitive digital products and responsive websites.",
  address: { "@type": "PostalAddress", addressCountry: "NG" },
  knowsAbout: ["UI/UX Design", "Product Design", "Web Design", "User Research", "Interaction Design", "Responsive Web Design", "Prototyping", "Design Systems"],
  sameAs: [
    "https://www.linkedin.com/in/khalid-usman-6606723a0",
    "https://www.behance.net/khalidusman12",
    "https://x.com/KAY_UIUX",
    "https://www.instagram.com/the.khaleed",
  ],
};

export const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Khalid Usman",
  alternateName: "Khalid Usman Adinoyi Portfolio",
  url: SITE_URL,
  inLanguage: "en-NG",
  publisher: { "@type": "Person", name: "Khalid Usman Adinoyi", url: SITE_URL },
};
