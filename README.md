# Khalid Usman | Portfolio

A personal portfolio showcasing selected work by **Khalid Usman**, a UI/UX and web designer. The site brings together product-design case studies, published websites, experiments, and ways to get in touch in a minimal, editorial-style experience.

<p align="center">
  <a href="https://khalid-usman.vercel.app">Live Portfolio</a> ·
  <a href="https://github.com/KHLLD00/khalid-usman">Source Code</a>
</p>

## Overview

The portfolio is built around a content-driven structure, so project details and selected site content can be managed through a Supabase-backed Studio interface rather than being hard-coded into each page.

### Highlights

- Responsive portfolio pages and project detail views
- Support for both design case studies and published websites
- Supabase-powered content management for projects and site settings
- Editable navigation, toolkit items, and experiments
- Project galleries, external links, featured status, publication status, and ordering
- Light and dark themes, with the initial theme based on the visitor's system preference
- Accessible focus styles and reduced-motion support for selected animations
- Page metadata and sitemap support

## Tech stack

- **React 19** and **TypeScript**
- **TanStack Start** and **TanStack Router**
- **Tailwind CSS 4**
- **Supabase** for data and image storage
- **TanStack Query** for server-state management
- **Vite** for development and production builds
- **Lucide React** for icons

## Getting started

### Prerequisites

- [Bun](https://bun.sh/) (recommended; the repository includes `bun.lock`)
- Access to the connected Supabase project, with the required schema, storage, authentication, and Row Level Security (RLS) policies configured

### 1. Clone the repository

```bash
git clone https://github.com/KHLLD00/khalid-usman.git
cd khalid-usman
```

### 2. Install dependencies

```bash
bun install
```

### 3. Configure environment variables

Create a `.env` file in the project root. Use the same project URL and publishable key for both the Vite client variables and the server-side variables:

```dotenv
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY

SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

Replace the placeholders with values from the Supabase project connected to the portfolio. The `VITE_*` variables are used by Vite for the client bundle; the non-prefixed variables provide the server-side fallback used during server rendering.

The publishable key is intended for application use. Keep database access protected with appropriate RLS policies. **Never put a Supabase secret key or service-role key in a `VITE_*` variable, commit credentials, or share real values in documentation.**

### 4. Start the development server

```bash
bun run dev
```

Use the local URL printed by Vite in your terminal.

## Available scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Start the development server |
| `bun run build` | Create a production build |
| `bun run build:dev` | Build using development mode |
| `bun run preview` | Preview the production build locally |
| `bun run lint` | Run ESLint |
| `bun run format` | Format files with Prettier |

## Project structure

```text
src/
├── components/
│   ├── site/          # Public-facing site and project content components
│   ├── studio/        # Studio/admin interface components
│   └── ui/            # Shared UI primitives
├── integrations/      # Supabase client and integration code
├── lib/               # CMS queries, helpers, and shared utilities
├── routes/            # TanStack file-based routes
├── router.tsx         # Router and query-client setup
├── server.ts          # Server entry point
└── styles.css         # Global styles, design tokens, and theme variables

supabase/              # Supabase configuration and database assets
public/                # Static assets
```

## Content management

The public site reads portfolio content from Supabase. CMS query helpers and data types are defined in `src/lib/cms.ts`.

The content model includes:

- **Projects:** case studies and published websites, with descriptions, slugs, imagery, project details, galleries, links, featured and publication states, and sort order
- **Site settings:** editable copy, contact information, social links, and section headings
- **Navigation items:** labels, URLs, visibility, and ordering
- **Toolkit items:** skills and tools shown on the site
- **Experiments:** optional experiments with descriptions, imagery, and external links

The connected Supabase project must have the expected tables, storage configuration, authentication, and RLS policies. Client-side filtering is not a security boundary; enforce access permissions in Supabase.

## Deployment

The live portfolio is hosted on Vercel.

1. Import the repository into Vercel and configure the project for the existing TanStack Start/Vite setup.
2. Add all four environment variables listed above to the relevant Vercel environments. Use the same project URL and publishable key for each matching pair.
3. Confirm the connected Supabase project has the required schema, storage, authentication, and RLS policies.
4. Deploy, then verify the homepage, project pages, Studio access, sitemap, and contact links.

Environment-variable changes generally require a new deployment to take effect.

## Maintenance

Before shipping code changes, run:

```bash
bun run lint
bun run build
```

Keep the interface responsive, preserve the restrained monochrome visual identity, and retain the original colours of project imagery. Update this README when setup requirements, scripts, integrations, or deployment steps change.

## Contact

- **Portfolio:** [khalid-usman.vercel.app](https://khalid-usman.vercel.app)
- **GitHub:** [@KHLLD00](https://github.com/KHLLD00)

## License

No license is currently specified in this repository. Contact the repository owner before reusing the code or assets.
