-- Seeds the copy for the White Notebook redesign. Existing keys are left untouched.
INSERT INTO public.site_settings (key, value) VALUES
  ('footer_role', 'UI/UX Designer & Web Designer'),
  ('hero_note', 'Selected work below'),
  ('intro_heading', 'I design interfaces that explain themselves and websites that feel considered rather than assembled.'),
  ('intro_capabilities', 'UI/UX Design, Web Design, Responsive Experiences, Prototyping, Interaction Design, Design Systems'),
  ('work_heading', 'Selected Work'),
  ('work_note', 'Open a sheet to read the case study'),
  ('work_view_all_text', 'View all work'),
  ('work_view_all_url', '/work'),
  ('websites_heading', 'Published Websites'),
  ('websites_description', 'Web experiences I''ve designed and brought to life.'),
  ('services_heading', 'What I Do'),
  ('services_list', E'UI/UX Design | Research-led interfaces for web and mobile products, from flows and wireframes to polished screens.\nWeb Design | Responsive websites designed to be clear, quick to read and ready to publish.\nPrototyping | Interactive prototypes that test ideas early and show how a product should feel.\nDesign Systems | Reusable components, tokens and guidelines that keep products consistent as they grow.'),
  ('about_label', 'Designer''s Note'),
  ('about_note', 'A little about me'),
  ('process_heading', 'How I Design'),
  ('process_note', 'Rarely a straight line'),
  ('process_steps', E'Discover | Understand the people, the problem and the constraints before anything is drawn.\nDefine | Turn what was learned into a clear brief, priorities and measures of success.\nDesign | Explore layouts, flows and visual direction, then commit to the strongest one.\nPrototype | Make it interactive so the idea can be tested with real people.\nRefine | Polish the details, fix what testing revealed and prepare the handoff.'),
  ('experiments_heading', 'Experiments'),
  ('contact_note', 'Say hello'),
  ('work_page_heading', 'Work'),
  ('work_page_description', 'Every project, from case studies to published websites.')
ON CONFLICT (key) DO NOTHING;
