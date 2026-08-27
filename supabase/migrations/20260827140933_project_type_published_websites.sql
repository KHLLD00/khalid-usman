-- Adds a Project Type classification to public.projects so a single project can be
-- either a Case Study (existing behaviour, unchanged) or a Published Website (new).
-- Existing rows default to 'case-study', so nothing currently published changes.

ALTER TABLE public.projects
  ADD COLUMN project_type text NOT NULL DEFAULT 'case-study',
  ADD COLUMN live_website_url text NOT NULL DEFAULT '',
  ADD COLUMN live_preview_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN preview_image_url text,
  ADD COLUMN live_status text NOT NULL DEFAULT 'live';

ALTER TABLE public.projects
  ADD CONSTRAINT projects_project_type_check
    CHECK (project_type IN ('case-study', 'published-website'));

ALTER TABLE public.projects
  ADD CONSTRAINT projects_live_status_check
    CHECK (live_status IN ('live', 'offline'));

CREATE INDEX projects_type_idx ON public.projects (project_type, sort_order, created_at DESC);
