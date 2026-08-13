-- New content collections for Studio-managed navigation, experiments, and toolkit items.
-- Reuses the existing has_role()/set_updated_at() functions and the same RLS pattern
-- already used by public.projects and public.site_settings.

CREATE TABLE public.nav_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL DEFAULT '',
  url text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.nav_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visible nav items are viewable by everyone" ON public.nav_items
  FOR SELECT TO anon, authenticated USING (visible = true);
CREATE POLICY "Admins can view all nav items" ON public.nav_items
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert nav items" ON public.nav_items
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update nav items" ON public.nav_items
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete nav items" ON public.nav_items
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER nav_items_set_updated_at BEFORE UPDATE ON public.nav_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Experiments: smaller design explorations, distinct from case-study projects.
CREATE TABLE public.experiments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  year text NOT NULL DEFAULT '',
  image_url text,
  image_alt text NOT NULL DEFAULT '',
  external_url text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published experiments are viewable by everyone" ON public.experiments
  FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Admins can view all experiments" ON public.experiments
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert experiments" ON public.experiments
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update experiments" ON public.experiments
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete experiments" ON public.experiments
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER experiments_set_updated_at BEFORE UPDATE ON public.experiments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Toolkit ticker items. Content and ordering only — animation/typography stay in code.
CREATE TABLE public.toolkit_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  category text,
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.toolkit_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visible toolkit items are viewable by everyone" ON public.toolkit_items
  FOR SELECT TO anon, authenticated USING (visible = true);
CREATE POLICY "Admins can view all toolkit items" ON public.toolkit_items
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert toolkit items" ON public.toolkit_items
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update toolkit items" ON public.toolkit_items
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete toolkit items" ON public.toolkit_items
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER toolkit_items_set_updated_at BEFORE UPDATE ON public.toolkit_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed nav items and toolkit items with the values currently hard-coded in the frontend,
-- so the site keeps rendering identically the moment Studio takes over.
INSERT INTO public.nav_items (label, url, sort_order, visible) VALUES
  ('Work', '/#work', 0, true),
  ('About', '/#about', 1, true),
  ('Contact', '/#contact', 2, true);

INSERT INTO public.toolkit_items (name, category, sort_order, visible) VALUES
  ('Product Design', 'Design', 0, true),
  ('UI Design', 'Design', 1, true),
  ('UX Design', 'Design', 2, true),
  ('Interaction Design', 'Design', 3, true),
  ('Design Systems', 'Design', 4, true),
  ('Prototyping', 'Design', 5, true),
  ('Figma', 'Tools', 6, true),
  ('FigJam', 'Tools', 7, true),
  ('Framer', 'Tools', 8, true),
  ('Notion', 'Tools', 9, true),
  ('Principle', 'Tools', 10, true);

-- Seed the new site_settings keys with the copy currently hard-coded on the homepage,
-- so nothing visually changes until these are edited in Studio.
INSERT INTO public.site_settings (key, value) VALUES
  ('hero_eyebrow', 'Product Design / UI/UX / Digital Experiences'),
  ('hero_headline', 'I design digital products with clarity and character.'),
  ('hero_description', 'Product designer focused on creating thoughtful digital experiences, interfaces and products.'),
  ('hero_image_url', ''),
  ('hero_image_alt', ''),
  ('primary_cta_text', 'View my work'),
  ('primary_cta_url', '/#work'),
  ('secondary_cta_text', 'Let''s talk'),
  ('secondary_cta_url', '/#contact'),
  ('about_heading', 'I''m Khalid Usman, a product designer interested in making digital products clearer, more useful and more human.'),
  ('contact_heading', 'Let''s make something worth using.'),
  ('footer_headline', 'Let''s make something worth using.'),
  ('footer_description', '')
ON CONFLICT (key) DO NOTHING;
