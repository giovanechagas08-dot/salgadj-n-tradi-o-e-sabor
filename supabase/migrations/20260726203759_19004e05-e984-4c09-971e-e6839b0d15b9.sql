DROP POLICY IF EXISTS "settings public read" ON public.site_settings;
CREATE POLICY "settings public read" ON public.site_settings
FOR SELECT TO anon, authenticated
USING (
  key = ANY (ARRAY['marca'::text,'contato'::text,'social'::text,'seo'::text,'pedido'::text])
  OR public.can_edit(auth.uid())
);