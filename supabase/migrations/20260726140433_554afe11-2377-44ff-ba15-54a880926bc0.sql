-- =========================================================
-- 0. Helper: role/permission functions
-- =========================================================
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'admin')
$$;

-- =========================================================
-- 1. price_table_access (grant private price tables to users)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.price_table_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  price_table_id uuid NOT NULL REFERENCES public.price_tables(id) ON DELETE CASCADE,
  granted_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, price_table_id)
);

GRANT SELECT ON public.price_table_access TO authenticated;
GRANT ALL ON public.price_table_access TO service_role;
ALTER TABLE public.price_table_access ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own price access read" ON public.price_table_access;
CREATE POLICY "own price access read" ON public.price_table_access
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "admin manage price access" ON public.price_table_access;
CREATE POLICY "admin manage price access" ON public.price_table_access
  FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP TRIGGER IF EXISTS touch_price_table_access ON public.price_table_access;
CREATE TRIGGER touch_price_table_access BEFORE UPDATE ON public.price_table_access
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE OR REPLACE FUNCTION public.can_view_price_table(_user_id uuid, _table_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.price_tables pt
    WHERE pt.id = _table_id
      AND pt.is_active
      AND (
        pt.is_public
        OR public.can_edit(_user_id)
        OR EXISTS (
          SELECT 1 FROM public.price_table_access a
          WHERE a.price_table_id = pt.id AND a.user_id = _user_id
        )
      )
  )
$$;

-- =========================================================
-- 2. Least-privilege GRANTs (revoke blanket anon/authenticated access)
-- =========================================================
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'analytics_events','audit_logs','banners','categories','contacts','content_categories',
    'content_posts','ctas','differentials','gallery_categories','gallery_items','heroes',
    'home_sections','page_views','pages','partner_media','partners','price_history',
    'price_tables','price_table_access','process_steps','product_faqs','product_prices',
    'products','profiles','quote_items','quotes','site_settings','stats','structure_sections',
    'testimonials','timeline_events','user_roles'
  ] LOOP
    EXECUTE format('REVOKE ALL ON public.%I FROM anon, authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
  END LOOP;

  -- Public-readable content (anon SELECT, editors write as authenticated)
  FOREACH t IN ARRAY ARRAY[
    'banners','categories','content_categories','content_posts','ctas','differentials',
    'gallery_categories','gallery_items','heroes','home_sections','pages','partner_media',
    'partners','price_tables','process_steps','product_faqs','product_prices','products',
    'site_settings','stats','structure_sections','testimonials','timeline_events'
  ] LOOP
    EXECUTE format('GRANT SELECT ON public.%I TO anon', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
  END LOOP;
END $$;

-- public write-only endpoints
GRANT INSERT ON public.contacts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contacts TO authenticated;
GRANT INSERT ON public.quotes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quotes TO authenticated;
GRANT INSERT ON public.quote_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quote_items TO authenticated;
GRANT INSERT ON public.page_views TO anon;
GRANT SELECT, INSERT ON public.page_views TO authenticated;
GRANT INSERT ON public.analytics_events TO anon;
GRANT SELECT, INSERT ON public.analytics_events TO authenticated;

-- admin-only surfaces (no anon at all)
GRANT SELECT ON public.audit_logs TO authenticated;
GRANT SELECT ON public.price_history TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;

-- =========================================================
-- 3. Public reads limited to published/active content
-- =========================================================
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'banners','categories','content_categories','ctas','differentials','gallery_categories',
    'heroes','home_sections','process_steps','stats','structure_sections','timeline_events'
  ] LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'public read ' || t, t);
    EXECUTE format($f$CREATE POLICY %I ON public.%I FOR SELECT TO anon, authenticated
      USING (is_active = true OR public.can_edit(auth.uid()))$f$, 'public read ' || t, t);
  END LOOP;

  FOREACH t IN ARRAY ARRAY['pages','products','partners','testimonials','gallery_items'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'public read ' || t, t);
    EXECUTE format($f$CREATE POLICY %I ON public.%I FOR SELECT TO anon, authenticated
      USING (is_published = true OR public.can_edit(auth.uid()))$f$, 'public read ' || t, t);
  END LOOP;
END $$;

DROP POLICY IF EXISTS "public read content_posts" ON public.content_posts;
CREATE POLICY "public read content_posts" ON public.content_posts
  FOR SELECT TO anon, authenticated
  USING ((is_published = true AND (published_at IS NULL OR published_at <= now())) OR public.can_edit(auth.uid()));

DROP POLICY IF EXISTS "public read product_faqs" ON public.product_faqs;
CREATE POLICY "public read product_faqs" ON public.product_faqs
  FOR SELECT TO anon, authenticated
  USING (
    public.can_edit(auth.uid())
    OR EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_id AND p.is_published)
  );

DROP POLICY IF EXISTS "public read partner_media" ON public.partner_media;
CREATE POLICY "public read partner_media" ON public.partner_media
  FOR SELECT TO anon, authenticated
  USING (
    public.can_edit(auth.uid())
    OR EXISTS (SELECT 1 FROM public.partners p WHERE p.id = partner_id AND p.is_published)
  );

DROP POLICY IF EXISTS "settings public read" ON public.site_settings;
CREATE POLICY "settings public read" ON public.site_settings
  FOR SELECT TO anon, authenticated
  USING (key IN ('marca','contato','social','seo') OR public.can_edit(auth.uid()));

DROP POLICY IF EXISTS "settings editor write" ON public.site_settings;
CREATE POLICY "settings admin write" ON public.site_settings
  FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- =========================================================
-- 4. Price visibility
-- =========================================================
DROP POLICY IF EXISTS "public read price_tables" ON public.price_tables;
CREATE POLICY "price tables scoped read" ON public.price_tables
  FOR SELECT TO anon, authenticated
  USING (
    (is_public = true AND is_active = true)
    OR public.can_edit(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.price_table_access a
      WHERE a.price_table_id = price_tables.id AND a.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "editor write price_tables" ON public.price_tables;
CREATE POLICY "admin write price_tables" ON public.price_tables
  FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "public read product_prices" ON public.product_prices;
CREATE POLICY "product prices scoped read" ON public.product_prices
  FOR SELECT TO anon, authenticated
  USING (public.can_view_price_table(auth.uid(), price_table_id));

DROP POLICY IF EXISTS "price history admin read" ON public.price_history;
CREATE POLICY "price history admin read" ON public.price_history
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

-- =========================================================
-- 5. Administrative / role tables: admin only
-- =========================================================
DROP POLICY IF EXISTS "admin read audit" ON public.audit_logs;
CREATE POLICY "admin read audit" ON public.audit_logs
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "admin manage roles" ON public.user_roles;
CREATE POLICY "admin manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "admin read profiles" ON public.profiles;
CREATE POLICY "admin read profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

-- =========================================================
-- 6. Public form endpoints: constrained WITH CHECK
-- =========================================================
DROP POLICY IF EXISTS "anyone track view" ON public.page_views;
CREATE POLICY "anyone track view" ON public.page_views
  FOR INSERT TO anon, authenticated
  WITH CHECK (path IS NOT NULL AND length(path) <= 512);

DROP POLICY IF EXISTS "anyone track event" ON public.analytics_events;
CREATE POLICY "anyone track event" ON public.analytics_events
  FOR INSERT TO anon, authenticated
  WITH CHECK (event_type IS NOT NULL AND length(event_type) <= 128);

DROP POLICY IF EXISTS "admin read views" ON public.page_views;
CREATE POLICY "admin read views" ON public.page_views
  FOR SELECT TO authenticated USING (public.can_edit(auth.uid()));

DROP POLICY IF EXISTS "admin read events" ON public.analytics_events;
CREATE POLICY "admin read events" ON public.analytics_events
  FOR SELECT TO authenticated USING (public.can_edit(auth.uid()));

DROP POLICY IF EXISTS "anyone create contact" ON public.contacts;
CREATE POLICY "anyone create contact" ON public.contacts
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    name IS NOT NULL AND length(name) BETWEEN 2 AND 160
    AND (email IS NOT NULL OR phone IS NOT NULL)
    AND coalesce(length(message), 0) <= 5000
    AND status = 'novo'
  );

DROP POLICY IF EXISTS "anyone create quote" ON public.quotes;
CREATE POLICY "anyone create quote" ON public.quotes
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    name IS NOT NULL AND length(name) BETWEEN 2 AND 160
    AND status = 'novo'
    AND (user_id IS NULL OR user_id = auth.uid())
  );

DROP POLICY IF EXISTS "anyone create quote items" ON public.quote_items;
CREATE POLICY "anyone create quote items" ON public.quote_items
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    quantity > 0
    AND EXISTS (SELECT 1 FROM public.quotes q WHERE q.id = quote_id)
  );

-- =========================================================
-- 7. Indexes on foreign keys / hot filters
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_published ON public.products(is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_product_prices_table ON public.product_prices(price_table_id);
CREATE INDEX IF NOT EXISTS idx_product_prices_product ON public.product_prices(product_id);
CREATE INDEX IF NOT EXISTS idx_product_faqs_product ON public.product_faqs(product_id);
CREATE INDEX IF NOT EXISTS idx_partner_media_partner ON public.partner_media(partner_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_partner ON public.testimonials(partner_id);
CREATE INDEX IF NOT EXISTS idx_quote_items_quote ON public.quote_items(quote_id);
CREATE INDEX IF NOT EXISTS idx_quote_items_product ON public.quote_items(product_id);
CREATE INDEX IF NOT EXISTS idx_quotes_user ON public.quotes(user_id);
CREATE INDEX IF NOT EXISTS idx_price_history_product ON public.price_history(product_id);
CREATE INDEX IF NOT EXISTS idx_price_history_table ON public.price_history(price_table_id);
CREATE INDEX IF NOT EXISTS idx_price_table_access_user ON public.price_table_access(user_id);
CREATE INDEX IF NOT EXISTS idx_gallery_items_category ON public.gallery_items(category_id);
CREATE INDEX IF NOT EXISTS idx_content_posts_category ON public.content_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created ON public.page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON public.analytics_events(created_at);