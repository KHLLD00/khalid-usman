GRANT SELECT ON public.nav_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.nav_items TO authenticated;
GRANT ALL ON public.nav_items TO service_role;

GRANT SELECT ON public.experiments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.experiments TO authenticated;
GRANT ALL ON public.experiments TO service_role;

GRANT SELECT ON public.toolkit_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.toolkit_items TO authenticated;
GRANT ALL ON public.toolkit_items TO service_role;