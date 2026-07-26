DROP POLICY IF EXISTS "media editors manage" ON storage.objects;
CREATE POLICY "media editors manage" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'media' AND public.can_edit(auth.uid()))
  WITH CHECK (bucket_id = 'media' AND public.can_edit(auth.uid()));

DROP POLICY IF EXISTS "media authenticated read" ON storage.objects;
CREATE POLICY "media authenticated read" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'media');

DROP POLICY IF EXISTS "documents editors manage" ON storage.objects;
CREATE POLICY "documents editors manage" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'documents' AND public.can_edit(auth.uid()))
  WITH CHECK (bucket_id = 'documents' AND public.can_edit(auth.uid()));