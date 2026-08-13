-- Update contact details with real values, and add X / Instagram links.
INSERT INTO public.site_settings (key, value) VALUES
  ('email', 'usmankhaleed899@gmail.com'),
  ('linkedin_url', 'https://www.linkedin.com/in/khalid-usman-6606723a0'),
  ('behance_url', 'https://www.behance.net/khalidusman12'),
  ('x_url', 'https://x.com/KAY_UIUX'),
  ('instagram_url', 'https://www.instagram.com/the.khaleed')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();
