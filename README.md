# Khalid Usman Portfolio

A content-driven portfolio for **Khalid Usman**, a UI/UX and web designer. The site presents selected case studies, published websites, design process, experiments, and contact information through a minimal editorial interface.

**Live site:** https://khalid-usman.vercel.app  
**Repository:** https://github.com/KHLLD00/khalid-usman

## Features

- Responsive portfolio homepage and project presentations
- Dynamic project content powered by Supabase
- Separate project types for case studies and published websites
- Content-managed navigation, site settings, toolkit items, and experiments
- Supabase-backed Studio routes for managing portfolio content
- Responsive image handling for project imagery
- Page metadata and a generated sitemap
- Light and dark themes, with the initial theme following the visitor's device preference
- Keyboard focus styles and reduced-motion support for selected animations

## Tech stack

- **React 19** and **TypeScript**
- **TanStack Start** and **TanStack Router**
- **Tailwind CSS 4**
- **Supabase** for data and image storage
- **TanStack Query** for server-state and data fetching
- **Vite** for development and production builds
- **Lucide React** for icons

## Getting started

### Requirements

- [Bun](https://bun.sh/) (recommended, the repository includes `bun.lock`)
- A Supabase project with the schema and tables expected by the application

### Install dependencies

```bash
bun install
```

### Configure environment variables

Create a local `.env` file in the project root. Add your Supabase project URL and publishable key:

```dotenv
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

Use the values from your Supabase project settings. The publishable/anon key is intended for client-side use; protect data with correctly configured Supabase Row Level Security (RLS) policies. **Never put a service-role key or other server secret in a `VITE_*` variable.**

Do not commit local environment files or real credentials. Keep `.env` private and share only placeholder values in documentation.

### Run locally

```bash
bun run dev
```

Vite prints the local development URL in the terminal.

## Available scripts

| Command | Purpose |
| --- | --- |
| `bun run dev` | Start the local development server |
| `bun run build` | Create a production build |
| `bun run build:dev` | Build using development mode |
| `bun run preview` | Preview the production build locally |
| `bun run lint` | Run ESLint |
| `bun run format` | Format repository files with Prettier |

## Project structure

```text
src/
├── components/
│   ├── site/       # Public-facing navigation, footer, project sheets, and content UI
│   ├── studio/     # Studio/admin interface components
│   └── ui/         # Shared UI primitives
├── integrations/   # Supabase client and integrations
├── lib/            # CMS queries, helpers, and shared utilities
├── routes/         # TanStack file-based routes
├── router.tsx      # Router and query-client setup
├── server.ts       # Server entry point
└── styles.css      # Global styles, design tokens, and theme variables

supabase/           # Supabase configuration and database assets
public/             # Static public assets
```

## Content management

Public portfolio content is queried from Supabase. The CMS helpers in `src/lib/cms.ts` define the data types and queries used by the interface.

The current content model includes:

- **Projects:** case studies and published websites, with slugs, descriptions, images, project details, gallery content, links, featured state, publication state, and sort order
- **Site settings:** editable copy, contact details, social links, section headings, and other homepage content
- **Navigation items:** editable labels, URLs, visibility, and order
- **Toolkit items:** editable skills/tools displayed in the site ticker
- **Experiments:** optional experiments with descriptions, imagery, and external links

Database schema, storage buckets, authentication, and RLS policies must be configured in Supabase for the connected features to work. Never rely on frontend filtering as the only security boundary; enforce permissions in Supabase.

## Theming

The site supports light and dark themes. On a first visit, it follows the visitor's operating-system preference. A manual selection is saved in the browser and takes precedence on later visits. The theme changes the portfolio's interface while keeping project imagery in its original colours.

## Deployment

The application is configured for a Vite/TanStack Start deployment and the portfolio is hosted at Vercel.

1. Import the repository into your deployment provider.
2. Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in the deployment environment.
3. Ensure the production Supabase project has the required tables, storage bucket, authentication, and RLS policies.
4. Run the production build and deploy the generated application using the provider's supported TanStack Start/Vite configuration.
5. Verify the homepage, project routes, Studio access, sitemap, and contact links on the deployed domain.

## Contributing and maintenance

This is a personal portfolio project. Before shipping changes, run:

```bash
bun run lint
bun run build
```

Keep the public interface responsive, preserve the restrained monochrome design system, and retain the original colours of project screenshots. Update this README whenever setup steps, scripts, integrations, or deployment requirements change.

## License

No license is currently specified. Contact the repository owner before reusing the code or assets.
