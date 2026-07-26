DROP POLICY IF EXISTS "anyone create quote items" ON public.quote_items;
REVOKE INSERT ON public.quote_items FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.submit_quote(_quote jsonb, _items jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _id uuid;
  _item jsonb;
  _count int;
BEGIN
  IF coalesce(trim(_quote->>'name'), '') = '' OR coalesce(trim(_quote->>'phone'), '') = '' THEN
    RAISE EXCEPTION 'Nome e telefone são obrigatórios';
  END IF;

  _count := coalesce(jsonb_array_length(_items), 0);
  IF _count > 200 THEN
    RAISE EXCEPTION 'Excesso de itens no orçamento';
  END IF;

  INSERT INTO public.quotes (name, phone, email, company, city, event_type, event_date, guests, message, source, user_id)
  VALUES (
    left(trim(_quote->>'name'), 160),
    left(trim(_quote->>'phone'), 40),
    nullif(left(trim(coalesce(_quote->>'email','')), 160), ''),
    nullif(left(trim(coalesce(_quote->>'company','')), 160), ''),
    nullif(left(trim(coalesce(_quote->>'city','')), 120), ''),
    nullif(left(trim(coalesce(_quote->>'event_type','')), 80), ''),
    nullif(_quote->>'event_date', '')::date,
    nullif(_quote->>'guests', '')::int,
    nullif(left(trim(coalesce(_quote->>'message','')), 4000), ''),
    'site',
    auth.uid()
  )
  RETURNING id INTO _id;

  FOR _item IN SELECT * FROM jsonb_array_elements(coalesce(_items, '[]'::jsonb))
  LOOP
    INSERT INTO public.quote_items (quote_id, product_id, product_name, quantity, unit)
    VALUES (
      _id,
      nullif(_item->>'product_id','')::uuid,
      left(coalesce(_item->>'product_name',''), 200),
      greatest(1, least(coalesce(nullif(_item->>'quantity','')::numeric, 1), 100000)),
      nullif(left(coalesce(_item->>'unit',''), 20), '')
    );
  END LOOP;

  RETURN _id;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_quote(jsonb, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_quote(jsonb, jsonb) TO anon, authenticated, service_role;

DROP POLICY IF EXISTS "media authenticated read" ON storage.objects;
CREATE POLICY "media editors read" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'media' AND public.can_edit(auth.uid()));