CREATE OR REPLACE FUNCTION public.has_price_table_grant(_user_id uuid, _table_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT _user_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.price_table_access a
    WHERE a.price_table_id = _table_id AND a.user_id = _user_id
  )
$$;
REVOKE ALL ON FUNCTION public.has_price_table_grant(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_price_table_grant(uuid, uuid) TO anon, authenticated, service_role;

DROP POLICY IF EXISTS "price tables scoped read" ON public.price_tables;
CREATE POLICY "price tables scoped read" ON public.price_tables
  FOR SELECT TO anon, authenticated
  USING (
    (is_public = true AND is_active = true)
    OR public.can_edit(auth.uid())
    OR public.has_price_table_grant(auth.uid(), id)
  );

CREATE OR REPLACE FUNCTION public.can_view_price_table(_user_id uuid, _table_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.price_tables pt
    WHERE pt.id = _table_id
      AND pt.is_active
      AND (
        pt.is_public
        OR public.can_edit(_user_id)
        OR public.has_price_table_grant(_user_id, pt.id)
      )
  )
$$;