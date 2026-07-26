
-- ============ ROLES & PROFILES ============
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'viewer');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.can_edit(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','editor'))
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ============ SITE SETTINGS ============
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  group_name text NOT NULL DEFAULT 'geral',
  label text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings public read" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "settings editor write" ON public.site_settings FOR ALL TO authenticated USING (public.can_edit(auth.uid())) WITH CHECK (public.can_edit(auth.uid()));
CREATE TRIGGER t_site_settings BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ HOME SECTIONS / HERO / BANNER / CTA ============
CREATE TABLE public.home_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  eyebrow text,
  title text NOT NULL,
  subtitle text,
  body text,
  image_url text,
  cta_label text,
  cta_href text,
  variant text NOT NULL DEFAULT 'light',
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.heroes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug text NOT NULL UNIQUE,
  eyebrow text,
  title text NOT NULL,
  subtitle text,
  image_url text,
  primary_cta_label text,
  primary_cta_href text,
  secondary_cta_label text,
  secondary_cta_href text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text,
  href text,
  image_url text,
  placement text NOT NULL DEFAULT 'topbar',
  starts_at timestamptz,
  ends_at timestamptz,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.ctas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  body text,
  button_label text,
  button_href text,
  variant text NOT NULL DEFAULT 'primary',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  value numeric NOT NULL,
  prefix text,
  suffix text,
  description text,
  context text NOT NULL DEFAULT 'home',
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.timeline_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year text NOT NULL,
  title text NOT NULL,
  description text,
  image_url text,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.structure_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  icon text,
  title text NOT NULL,
  description text,
  image_url text,
  metric_label text,
  metric_value text,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.differentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon text,
  title text NOT NULL,
  description text,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.process_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  step_number int NOT NULL,
  title text NOT NULL,
  description text,
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  subtitle text,
  body text,
  image_url text,
  seo_title text,
  seo_description text,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============ CATALOG ============
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  image_url text,
  seo_title text,
  seo_description text,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  short_description text,
  description text,
  story text,
  ingredients text,
  differentials text,
  production text,
  occasion text,
  qty_per_person text,
  image_url text,
  gallery jsonb NOT NULL DEFAULT '[]'::jsonb,
  weight_grams numeric,
  unit text NOT NULL DEFAULT 'cento',
  is_available boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  seo_title text,
  seo_description text,
  display_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.product_faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.price_tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  audience text NOT NULL DEFAULT 'varejo',
  is_public boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  valid_from date,
  valid_to date,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.product_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  price_table_id uuid NOT NULL REFERENCES public.price_tables(id) ON DELETE CASCADE,
  price numeric(10,2) NOT NULL,
  min_quantity int NOT NULL DEFAULT 1,
  unit text NOT NULL DEFAULT 'cento',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, price_table_id)
);
CREATE TABLE public.price_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  price_table_id uuid REFERENCES public.price_tables(id) ON DELETE CASCADE,
  old_price numeric(10,2),
  new_price numeric(10,2),
  changed_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.log_price_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.price_history (product_id, price_table_id, old_price, new_price, changed_by)
  VALUES (NEW.product_id, NEW.price_table_id, CASE WHEN TG_OP='UPDATE' THEN OLD.price ELSE NULL END, NEW.price, auth.uid());
  RETURN NEW;
END; $$;
CREATE TRIGGER t_price_history AFTER INSERT OR UPDATE OF price ON public.product_prices
FOR EACH ROW EXECUTE FUNCTION public.log_price_change();

-- ============ PARTNERS / TESTIMONIALS / GALLERY ============
CREATE TABLE public.partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  segment text,
  logo_url text,
  cover_url text,
  summary text,
  partnership_story text,
  challenge text,
  solution text,
  result text,
  metrics jsonb NOT NULL DEFAULT '[]'::jsonb,
  seo_title text,
  seo_description text,
  is_featured boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.partner_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  media_type text NOT NULL DEFAULT 'image',
  url text NOT NULL,
  caption text,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  author_role text,
  company text,
  partner_id uuid REFERENCES public.partners(id) ON DELETE SET NULL,
  quote text NOT NULL,
  rating int,
  avatar_url text,
  display_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.gallery_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES public.gallery_categories(id) ON DELETE SET NULL,
  media_type text NOT NULL DEFAULT 'image',
  url text NOT NULL,
  thumb_url text,
  title text,
  caption text,
  display_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============ CONTEUDOS ============
CREATE TABLE public.content_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.content_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES public.content_categories(id) ON DELETE SET NULL,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  body text,
  cover_url text,
  author_name text,
  reading_minutes int,
  seo_title text,
  seo_description text,
  published_at timestamptz DEFAULT now(),
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============ COMERCIAL ============
CREATE TABLE public.quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  name text NOT NULL,
  email text,
  phone text NOT NULL,
  company text,
  event_type text,
  event_date date,
  guests int,
  city text,
  message text,
  status text NOT NULL DEFAULT 'novo',
  source text NOT NULL DEFAULT 'site',
  total_estimated numeric(10,2),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.quote_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  quantity numeric NOT NULL DEFAULT 1,
  unit text,
  unit_price numeric(10,2),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  subject text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'novo',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============ ANALYTICS & AUDIT ============
CREATE TABLE public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  session_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  target text,
  path text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  session_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity text NOT NULL,
  entity_id uuid,
  action text NOT NULL,
  diff jsonb,
  user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============ GRANTS + RLS: CONTEUDO PUBLICO ============
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['home_sections','heroes','banners','ctas','stats','timeline_events','structure_sections','differentials','process_steps','pages','categories','products','product_faqs','price_tables','product_prices','partners','partner_media','testimonials','gallery_categories','gallery_items','content_categories','content_posts']
  LOOP
    EXECUTE format('GRANT SELECT ON public.%I TO anon, authenticated;', t);
    EXECUTE format('GRANT INSERT, UPDATE, DELETE ON public.%I TO authenticated;', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role;', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
    EXECUTE format('CREATE POLICY "public read %1$s" ON public.%1$I FOR SELECT TO anon, authenticated USING (true);', t);
    EXECUTE format('CREATE POLICY "editor write %1$s" ON public.%1$I FOR ALL TO authenticated USING (public.can_edit(auth.uid())) WITH CHECK (public.can_edit(auth.uid()));', t);
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name=t AND column_name='updated_at') THEN
      EXECUTE format('CREATE TRIGGER t_%1$s BEFORE UPDATE ON public.%1$I FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();', t);
    END IF;
  END LOOP;
END $$;

-- price_history: somente admin
GRANT SELECT ON public.price_history TO authenticated;
GRANT ALL ON public.price_history TO service_role;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "price history admin read" ON public.price_history FOR SELECT TO authenticated USING (public.can_edit(auth.uid()));

-- quotes / quote_items / contacts: qualquer visitante cria, admin le
GRANT INSERT ON public.quotes TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.quotes TO authenticated;
GRANT ALL ON public.quotes TO service_role;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone create quote" ON public.quotes FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin read quotes" ON public.quotes FOR SELECT TO authenticated USING (public.can_edit(auth.uid()) OR auth.uid() = user_id);
CREATE POLICY "admin manage quotes" ON public.quotes FOR UPDATE TO authenticated USING (public.can_edit(auth.uid())) WITH CHECK (public.can_edit(auth.uid()));
CREATE POLICY "admin delete quotes" ON public.quotes FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER t_quotes BEFORE UPDATE ON public.quotes FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

GRANT INSERT ON public.quote_items TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.quote_items TO authenticated;
GRANT ALL ON public.quote_items TO service_role;
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone create quote items" ON public.quote_items FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin read quote items" ON public.quote_items FOR SELECT TO authenticated USING (public.can_edit(auth.uid()));
CREATE POLICY "admin manage quote items" ON public.quote_items FOR ALL TO authenticated USING (public.can_edit(auth.uid())) WITH CHECK (public.can_edit(auth.uid()));

GRANT INSERT ON public.contacts TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contacts TO authenticated;
GRANT ALL ON public.contacts TO service_role;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone create contact" ON public.contacts FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin manage contacts" ON public.contacts FOR ALL TO authenticated USING (public.can_edit(auth.uid())) WITH CHECK (public.can_edit(auth.uid()));

-- analytics: qualquer visitante grava, admin le
GRANT INSERT ON public.page_views TO anon, authenticated;
GRANT SELECT ON public.page_views TO authenticated;
GRANT ALL ON public.page_views TO service_role;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone track view" ON public.page_views FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin read views" ON public.page_views FOR SELECT TO authenticated USING (public.can_edit(auth.uid()));

GRANT INSERT ON public.analytics_events TO anon, authenticated;
GRANT SELECT ON public.analytics_events TO authenticated;
GRANT ALL ON public.analytics_events TO service_role;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone track event" ON public.analytics_events FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin read events" ON public.analytics_events FOR SELECT TO authenticated USING (public.can_edit(auth.uid()));

GRANT SELECT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin read audit" ON public.audit_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- ============ SEEDS ============
INSERT INTO public.site_settings (key, group_name, label, value) VALUES
 ('contato','contato','Contato', '{"whatsapp":"5511999999999","telefone":"(11) 9999-9999","email":"contato@salgadjen.com.br","endereco":"","cidade":"","estado":"SP","horarios":"Segunda a sábado, das 8h às 18h"}'),
 ('marca','geral','Marca', '{"nome":"Salgadjén","fundacao":"1988","anos":"38","headline":"Há 38 anos fazendo parte dos melhores momentos."}'),
 ('social','geral','Redes sociais', '{"instagram":"","facebook":""}'),
 ('seo','seo','SEO', '{"title":"Salgadjén — Soluções gastronômicas para eventos desde 1988","description":"Há 38 anos produzindo salgados, doces e refeições para buffets, empresas e grandes eventos. Estrutura, pontualidade e atendimento próximo."}');

INSERT INTO public.heroes (page_slug, eyebrow, title, subtitle, primary_cta_label, primary_cta_href, secondary_cta_label, secondary_cta_href) VALUES
 ('home','Desde 1988','Há 38 anos fazendo parte dos melhores momentos.','Somos uma empresa familiar que entrega tranquilidade a quem organiza eventos. Os produtos são consequência do cuidado com cada detalhe.','Solicitar orçamento','/orcamento','Conheça nossa história','/historia');

INSERT INTO public.home_sections (slug, eyebrow, title, subtitle, body, variant, display_order, cta_label, cta_href) VALUES
 ('experiencia','Experiência','Não entregamos salgados. Participamos de momentos.','O casamento da filha. A confraternização da equipe. O evento que não pode dar errado.','Em quase quatro décadas aprendemos que o que se contrata não é um cardápio: é a certeza de que tudo vai chegar no horário, na quantidade certa e do jeito combinado.','light',1,'A experiência Salgadjén','/experiencia'),
 ('historia','1988 → hoje','Uma história que começou na cozinha de casa.','Três gerações depois, o cuidado continua o mesmo.','O que nasceu como produção artesanal para a vizinhança se tornou uma operação capaz de atender grandes eventos — sem perder o nome de quem atende do outro lado da linha.','purple',2,'Nossa linha do tempo','/historia'),
 ('quem-somos','Quem somos','Empresa familiar, gestão profissional.','Gente que conhece cada etapa da produção pelo nome.','Somos uma família à frente de uma equipe treinada, com processos definidos e responsabilidade sobre cada entrega.','light',3,'Conheça a empresa','/quem-somos'),
 ('estrutura','Estrutura','Capacidade para o evento que você está planejando.','Produção, congelamento, expedição e logística próprios.','Estrutura pensada para atender do aniversário de 30 convidados ao evento corporativo de milhares.','cream',4,'Ver nossa estrutura','/estrutura'),
 ('processos','Processos','Produção sob demanda, do pedido à entrega.','Nada fica esperando na prateleira.','Cada etapa é registrada e conferida: recebimento, preparo, montagem, congelamento, conferência e expedição.','light',5,'Como produzimos','/processos'),
 ('diferenciais','Diferenciais','O que sustenta 38 anos de recorrência.','Não é sorte. É método.',NULL,'purple',6,'Nossos diferenciais','/diferenciais'),
 ('parceiros','Parceiros','Quem confia a própria reputação à nossa.','Buffets, casas de festa e empresas que atendemos há anos.','Mais do que fornecedores, somos parte da operação dos nossos parceiros.','light',7,'Ver cases','/parceiros'),
 ('grandes-eventos','Grandes Eventos','Volume alto, padrão constante.','Escala não pode custar qualidade.','Planejamento de produção, cronograma de entregas e equipe dedicada para eventos de grande porte.','cream',8,'Grandes eventos','/grandes-eventos'),
 ('produtos','Produtos','Agora sim, o que servimos.','Salgados, doces e refeições produzidos sob demanda.','Produtos bem recheados, ingredientes selecionados e receitas ajustadas ao longo de 38 anos.','light',9,'Ver produtos','/produtos'),
 ('tabela','Valores','Transparência desde a primeira conversa.','Tabela organizada por categoria e volume.','Consulte os valores e monte seu orçamento no seu tempo.','light',10,'Tabela de valores','/tabela-de-valores');

INSERT INTO public.ctas (slug, title, body, button_label, button_href) VALUES
 ('orcamento-final','Vamos planejar o seu evento?','Monte seu orçamento com calma, salve e continue depois. Nossa equipe responde com uma proposta detalhada.','Solicitar orçamento','/orcamento'),
 ('whatsapp','Prefere conversar agora?','Fale direto com nossa equipe comercial pelo WhatsApp.','Chamar no WhatsApp','#whatsapp');

INSERT INTO public.stats (label, value, suffix, description, display_order) VALUES
 ('Anos de mercado', 38, NULL, 'Fundada em 1988, sob a mesma família.', 1),
 ('Eventos atendidos por ano', 1200, '+', 'De festas particulares a eventos corporativos.', 2),
 ('Parceiros ativos', 80, '+', 'Buffets, casas de festa e empresas.', 3),
 ('Capacidade diária', 40000, '+', 'Unidades produzidas por dia em alta temporada.', 4);

INSERT INTO public.timeline_events (year, title, description, display_order) VALUES
 ('1988','O começo','A produção nasce em casa, para festas de família e vizinhos.',1),
 ('1996','Primeira cozinha própria','A demanda supera a estrutura doméstica e vem o primeiro espaço dedicado.',2),
 ('2004','Atendimento a buffets','Começa a operação B2B, com entregas programadas e padrão constante.',3),
 ('2012','Congelamento e logística próprios','Investimento em câmaras frias e frota, garantindo pontualidade.',4),
 ('2019','Eventos corporativos','Estrutura ampliada para atender empresas e eventos de grande porte.',5),
 ('2026','38 anos','Três gerações, milhares de eventos e o mesmo cuidado do primeiro dia.',6);

INSERT INTO public.structure_sections (slug, icon, title, description, metric_label, metric_value, display_order) VALUES
 ('producao','Factory','Produção','Área produtiva segmentada por tipo de produto, evitando cruzamento de processos.','Área produtiva','1.200 m²',1),
 ('equipe','Users','Equipe','Time treinado, com funções definidas e supervisão em todos os turnos.','Colaboradores','60+',2),
 ('equipamentos','Settings','Equipamentos','Maquinário industrial para massa, recheio, modelagem e empanamento.','Linhas de produção','4',3),
 ('qualidade','ShieldCheck','Controle de qualidade','Conferência de lote, peso, recheio e aparência antes da liberação.','Conferências por lote','3',4),
 ('processo','ListChecks','Processo produtivo','Fluxo documentado do recebimento do insumo à expedição.','Etapas registradas','9',5),
 ('armazenamento','Package','Armazenamento','Estoque organizado por validade, com giro controlado.','Posições de estoque','800',6),
 ('congelamento','Snowflake','Congelamento','Túnel de congelamento rápido que preserva textura e sabor.','Temperatura','-18°C',7),
 ('logistica','Truck','Logística','Roteirização das entregas por região e horário do evento.','Regiões atendidas','Grande SP',8),
 ('expedicao','PackageCheck','Expedição','Separação conferida item a item, com romaneio por cliente.','Conferência','Dupla',9),
 ('entregas','Clock','Entregas','Janela de entrega combinada com o cronograma do evento.','Pontualidade','98%',10),
 ('capacidade','TrendingUp','Capacidade produtiva','Escala planejada com antecedência para grandes volumes.','Pico diário','40.000 un.',11);

INSERT INTO public.process_steps (step_number, title, description) VALUES
 (1,'Briefing do evento','Entendemos tipo, data, número de convidados e formato do serviço.'),
 (2,'Proposta e cronograma','Definimos quantidades, mix de produtos e janela de entrega.'),
 (3,'Compra de insumos','Ingredientes adquiridos por pedido, sem estoque parado.'),
 (4,'Preparo','Massas e recheios produzidos no dia programado.'),
 (5,'Montagem','Modelagem e recheio conferidos por peso e padrão.'),
 (6,'Congelamento','Túnel rápido para preservar textura e sabor.'),
 (7,'Conferência','Checagem de lote, quantidade e aparência.'),
 (8,'Expedição','Separação por cliente com romaneio.'),
 (9,'Entrega','Transporte refrigerado dentro da janela combinada.');

INSERT INTO public.differentials (icon, title, description, display_order) VALUES
 ('Home','Empresa familiar','Quem decide atende. Não há camadas entre você e a produção.',1),
 ('CalendarClock','Fundada em 1988','Trinta e oito anos de recorrência com os mesmos clientes.',2),
 ('ChefHat','Produção sob demanda','Nada é produzido antes da hora nem fica esperando.',3),
 ('Sparkles','Salgados frescos','Congelamento rápido logo após o preparo preserva o sabor.',4),
 ('Wheat','Ingredientes de qualidade','Fornecedores auditados e insumos selecionados.',5),
 ('Layers','Produtos bem recheados','Recheio conferido por peso, unidade a unidade.',6),
 ('HeartHandshake','Atendimento próximo','Uma pessoa responsável pelo seu evento, do início ao fim.',7),
 ('Building2','Estrutura para grandes eventos','Planejamento de escala sem perder padrão.',8),
 ('Briefcase','Atendimento B2B','Contratos, recorrência e previsibilidade para parceiros.',9),
 ('Users','Atendimento B2C','Festas particulares atendidas com o mesmo cuidado.',10);

INSERT INTO public.categories (name, slug, description, display_order) VALUES
 ('Salgados fritos','salgados-fritos','Clássicos que não podem faltar, bem recheados e crocantes.',1),
 ('Salgados assados','salgados-assados','Massas leves, ideais para eventos corporativos.',2),
 ('Finger food','finger-food','Porções pensadas para serviço volante e coquetéis.',3),
 ('Doces','doces','Doces de festa e sobremesas para encerrar bem.',4),
 ('Refeições','refeicoes','Pratos quentes e refeições coletivas sob demanda.',5);

INSERT INTO public.price_tables (name, slug, audience, is_public, display_order) VALUES
 ('Varejo','varejo','varejo',true,1),
 ('Buffets e casas de festa','buffets','buffet',false,2),
 ('Corporativo','corporativo','corporativo',false,3);

INSERT INTO public.products (category_id, name, slug, short_description, description, story, ingredients, differentials, production, occasion, qty_per_person, unit, weight_grams, is_featured, display_order, seo_title, seo_description)
SELECT c.id, v.name, v.slug, v.short_desc, v.descr, v.story, v.ingr, v.diff, v.prod, v.occ, v.qty, 'cento', v.peso, v.feat, v.ord, v.seot, v.seod
FROM (VALUES
 ('salgados-fritos','Coxinha de frango','coxinha-de-frango','Massa leve e recheio generoso de frango desfiado temperado.','A coxinha da Salgadjén é feita com massa de batata e caldo de frango, recheada com frango desfiado no ponto certo de tempero.','A primeira receita da casa, ajustada ao longo de 38 anos. É por ela que a maioria dos clientes conhece a Salgadjén.','Frango, batata, farinha de trigo, caldo natural, temperos frescos.','Recheio pesado unidade a unidade. Massa que não descola na fritura.','Preparada no dia programado, modelada, empanada e congelada em túnel rápido.','Aniversários, casamentos, confraternizações e coquetéis.','8 a 10 unidades por pessoa em festas de 4 horas.',25,true,1,'Coxinha de frango para festas e eventos | Salgadjén','Coxinha de frango bem recheada, produzida sob demanda para festas, buffets e eventos corporativos. Solicite seu orçamento.'),
 ('salgados-fritos','Bolinha de queijo','bolinha-de-queijo','Queijo derretido em massa crocante e dourada.','Bolinha clássica com recheio de queijo que derrete na mordida, sem soltar óleo.','Entrou no cardápio nos anos 90 a pedido dos primeiros buffets parceiros.','Queijo muçarela, farinha de trigo, leite, manteiga.','Queijo em cubos, não ralado — garante o fio na mordida.','Modelada manualmente e congelada logo após o empanamento.','Coquetéis, happy hour e festas infantis.','6 a 8 unidades por pessoa.',20,true,2,'Bolinha de queijo para eventos | Salgadjén','Bolinha de queijo crocante e bem recheada para festas e eventos. Produção sob demanda e entrega pontual.'),
 ('salgados-fritos','Risoles de carne','risoles-de-carne','Massa fina e recheio de carne moída temperada.','Risoles de massa fina, com recheio suculento de carne moída refogada.','Receita trazida pela fundadora, mantida sem alterações desde 1988.','Carne bovina moída, cebola, alho, farinha de trigo, leite.','Massa fina que valoriza o recheio.','Recheio refogado no dia e resfriado antes da montagem.','Festas familiares e eventos corporativos.','6 a 8 unidades por pessoa.',25,false,3,'Risoles de carne para festas | Salgadjén','Risoles de carne com massa fina e recheio generoso, produzidos sob demanda para eventos.'),
 ('salgados-assados','Empada de frango','empada-de-frango','Massa amanteigada com recheio cremoso de frango.','Empadinha de massa amanteigada que desmancha, com recheio cremoso de frango.','Criada para atender eventos corporativos que pediam opções assadas.','Farinha de trigo, manteiga, frango, creme de leite, temperos.','Massa amanteigada feita na casa, sem gordura vegetal.','Assada em forno industrial e resfriada controladamente.','Eventos corporativos, coffee breaks e recepções.','4 a 6 unidades por pessoa.',30,true,4,'Empada de frango para eventos corporativos | Salgadjén','Empada de frango com massa amanteigada, ideal para coffee break e eventos corporativos.'),
 ('salgados-assados','Esfiha de carne','esfiha-de-carne','Massa macia com recheio de carne temperada.','Esfiha aberta, de massa macia e recheio de carne com limão.','Incorporada ao cardápio pela procura dos buffets da região.','Farinha de trigo, carne bovina, cebola, tomate, limão.','Massa de fermentação lenta, mais leve.','Fermentação controlada e forno industrial.','Coquetéis, eventos corporativos e festas.','4 a 6 unidades por pessoa.',35,false,5,'Esfiha de carne para eventos | Salgadjén','Esfiha de carne com massa de fermentação lenta, produzida sob demanda para eventos.'),
 ('finger-food','Mini quiche','mini-quiche','Porção individual de quiche para serviço volante.','Mini quiche em massa quebradiça, recheios variados, ideal para coquetéis.','Desenvolvida para eventos que pediam apresentação mais sofisticada.','Farinha, manteiga, ovos, creme de leite, recheios variados.','Formato padronizado para serviço volante elegante.','Montada individualmente e assada em lotes pequenos.','Coquetéis, eventos corporativos e casamentos.','4 a 5 unidades por pessoa.',30,false,6,'Mini quiche para coquetéis | Salgadjén','Mini quiche para coquetéis e eventos corporativos, com apresentação impecável.'),
 ('doces','Brigadeiro gourmet','brigadeiro-gourmet','Brigadeiro de chocolate nobre, ponto de corte.','Brigadeiro feito com chocolate nobre, no ponto certo para mesa de doces.','Nasceu do pedido de clientes de casamento por uma mesa de doces completa.','Chocolate nobre, leite condensado, manteiga, creme de leite.','Ponto de corte, não amolece na mesa.','Produzido em pequenas panelas para manter o padrão.','Casamentos, aniversários e mesas de doces.','4 a 6 unidades por pessoa.',20,true,7,'Brigadeiro gourmet para festas | Salgadjén','Brigadeiro gourmet de chocolate nobre para mesas de doces em casamentos e aniversários.'),
 ('refeicoes','Refeição corporativa','refeicao-corporativa','Prato quente balanceado para equipes e eventos.','Refeições completas produzidas sob demanda para empresas e eventos de longa duração.','Serviço criado a partir da demanda de clientes corporativos já atendidos com salgados.','Proteína, acompanhamentos, guarnição e salada.','Cardápio ajustado por evento, com opções vegetarianas.','Produção no dia e transporte em embalagem térmica.','Eventos de longa duração, treinamentos e operações.','1 porção por pessoa.',450,false,8,'Refeições corporativas para eventos | Salgadjén','Refeições corporativas produzidas sob demanda, com cardápio ajustado e entrega pontual.')
) AS v(cat, name, slug, short_desc, descr, story, ingr, diff, prod, occ, qty, peso, feat, ord, seot, seod)
JOIN public.categories c ON c.slug = v.cat;

INSERT INTO public.product_faqs (product_id, question, answer, display_order)
SELECT p.id, q.question, q.answer, q.ord FROM public.products p
CROSS JOIN (VALUES
 ('Qual o pedido mínimo?','Trabalhamos a partir de 1 cento por sabor, com flexibilidade para eventos maiores.',1),
 ('Os produtos chegam prontos ou congelados?','Entregamos congelados, prontos para fritar ou assar, salvo combinação diferente.',2),
 ('Com quanta antecedência devo pedir?','Recomendamos 7 dias para festas e 15 dias para grandes eventos.',3)
) AS q(question, answer, ord);

INSERT INTO public.product_prices (product_id, price_table_id, price, unit)
SELECT p.id, t.id,
  CASE p.slug
    WHEN 'coxinha-de-frango' THEN 149.00
    WHEN 'bolinha-de-queijo' THEN 139.00
    WHEN 'risoles-de-carne' THEN 149.00
    WHEN 'empada-de-frango' THEN 189.00
    WHEN 'esfiha-de-carne' THEN 179.00
    WHEN 'mini-quiche' THEN 219.00
    WHEN 'brigadeiro-gourmet' THEN 159.00
    ELSE 39.90 END,
  CASE WHEN p.slug = 'refeicao-corporativa' THEN 'unidade' ELSE 'cento' END
FROM public.products p CROSS JOIN public.price_tables t WHERE t.slug = 'varejo';

INSERT INTO public.partners (name, slug, segment, summary, partnership_story, challenge, solution, result, is_featured, display_order, metrics) VALUES
 ('Camarote Aura','camarote-aura','Grandes eventos','Parceria em construção para operação gastronômica de camarote.','Parceria em desenvolvimento. Assim que concluída, ocupará posição de destaque nesta página.','Servir milhares de convidados com padrão constante ao longo de todo o evento.','Planejamento de produção dedicado, cronograma de reposição e equipe exclusiva.','Em construção.',true,1,'[]'),
 ('Buffet Villa Real','buffet-villa-real','Buffet','Parceiro desde 2009 no fornecimento de salgados para casamentos.','Começou com um pedido pontual de 3 centos e virou contrato mensal.','Padrão constante em finais de semana com múltiplos eventos simultâneos.','Cronograma de entregas semanal e estoque de segurança planejado.','17 anos de recorrência, sem ruptura de fornecimento.',false,2,'[{"label":"Anos de parceria","value":"17"},{"label":"Eventos por ano","value":"240+"}]'),
 ('Espaço Jardins Eventos','espaco-jardins','Casa de festas','Fornecimento integral de salgados e doces para a casa.','Assumimos o fornecimento após problemas recorrentes de atraso com o fornecedor anterior.','Entregas sempre no horário, mesmo em datas de pico.','Roteirização própria e janela de entrega acordada por evento.','98% de pontualidade medida pela própria casa.',false,3,'[{"label":"Pontualidade","value":"98%"}]');

INSERT INTO public.testimonials (author_name, author_role, company, quote, rating, display_order) VALUES
 ('Marina Alcântara','Coordenadora de eventos','Buffet Villa Real','Em dezessete anos, nunca precisei ligar cobrando uma entrega. Isso, no nosso mercado, é raro.',5,1),
 ('Roberto Nunes','Gerente administrativo','Grupo Terrare','Contratamos para a confraternização de 800 pessoas. Chegou no horário, na quantidade certa e sobrou elogio.',5,2),
 ('Cláudia Reis','Cliente','Festa de 15 anos','Eu estava nervosa com tudo. A parte da comida foi a única que não me deu trabalho.',5,3);

INSERT INTO public.gallery_categories (name, slug, display_order) VALUES
 ('Eventos','eventos',1),('Produção','producao',2),('Equipe','equipe',3),('Bastidores','bastidores',4),
 ('Clientes','clientes',5),('Grandes Eventos','grandes-eventos',6),('Buffet','buffet',7),('Corporativo','corporativo',8);

INSERT INTO public.content_categories (name, slug, display_order) VALUES
 ('Planejamento','planejamento',1),('Fornecedores','fornecedores',2),('Corporativo','corporativo',3),('Bastidores','bastidores',4);

INSERT INTO public.content_posts (category_id, title, slug, excerpt, body, author_name, reading_minutes, seo_title, seo_description)
SELECT c.id, v.title, v.slug, v.excerpt, v.body, 'Equipe Salgadjén', v.mins, v.seot, v.seod
FROM (VALUES
 ('planejamento','Como calcular a quantidade de salgados para uma festa','como-calcular-quantidade-de-salgados','A conta que evita sobra e, principalmente, evita faltar.','A regra geral é de 8 a 10 salgados por pessoa em eventos de até 4 horas, considerando que não haverá jantar servido. Para coquetéis com serviço volante, some 2 unidades por hora adicional. Se houver mesa de doces, reduza levemente os salgados doces e mantenha os fritos.\n\nAlguns ajustes importantes: eventos com público majoritariamente adulto e bebida alcoólica consomem mais; festas infantis consomem menos por pessoa, mas com picos concentrados no início. Sempre planeje uma margem de 10% para imprevistos — é mais barato do que faltar.','Como calcular a quantidade de salgados para uma festa | Salgadjén','Aprenda a calcular quantos salgados pedir por pessoa em festas, casamentos e eventos corporativos, com margens de segurança.',6),
 ('fornecedores','Como escolher um fornecedor de salgados para eventos','como-escolher-fornecedor-para-eventos','Preço é o último critério. Comece pelos outros seis.','Antes do preço, avalie: capacidade produtiva comprovada, pontualidade histórica, controle de qualidade documentado, estrutura de congelamento e logística, flexibilidade para alterações de última hora e clareza no atendimento.\n\nPeça referências de clientes com perfil parecido com o seu. Visite a produção, se possível. E observe como o fornecedor responde antes de fechar: o padrão de atendimento na venda costuma ser o melhor que você vai receber.','Como escolher um fornecedor de salgados para eventos | Salgadjén','Seis critérios objetivos para escolher um fornecedor de salgados confiável para buffets, empresas e grandes eventos.',7),
 ('corporativo','Tendências para eventos corporativos','tendencias-para-eventos-corporativos','O que mudou na mesa dos eventos de empresa.','O formato volante ganhou espaço sobre o serviço à mesa: mais circulação, mais conversa, menos tempo parado. Cresce a demanda por opções vegetarianas e por porções menores, que permitem experimentar mais itens.\n\nOutro movimento claro é a exigência de previsibilidade: empresas querem cronograma de entrega documentado e responsável nominal pelo evento.','Tendências para eventos corporativos | Salgadjén','As tendências que estão mudando o formato dos eventos corporativos e o que isso exige do fornecedor gastronômico.',5),
 ('planejamento','Organização de festas: o cronograma que salva o evento','organizacao-de-festas-cronograma','Da contratação à hora de servir, em ordem.','Sessenta dias antes: defina data, local e número aproximado de convidados. Quarenta e cinco dias: feche buffet ou fornecedor de alimentação. Trinta dias: confirme cardápio e quantidades. Quinze dias: confirme a lista final e ajuste quantidades. Sete dias: confirme a janela de entrega.\n\nNo dia, defina quem recebe a entrega e onde os produtos ficarão armazenados. Parece detalhe, mas é onde a maioria dos problemas acontece.','Organização de festas: cronograma completo | Salgadjén','Cronograma prático para organizar festas e eventos sem correria, do planejamento à entrega no dia.',6),
 ('bastidores','Bastidores da produção: um dia na Salgadjén','bastidores-da-producao','O que acontece entre o pedido e a entrega.','A produção começa antes do amanhecer com o recebimento dos insumos do dia. Nada é comprado para estoque: cada pedido gera sua própria lista de compras.\n\nDurante a manhã, massas e recheios são preparados em linhas separadas. A montagem acontece com conferência de peso por amostragem. À tarde, o túnel de congelamento recebe os lotes e, ao final do dia, a expedição separa por cliente com romaneio conferido duas vezes.','Bastidores da produção Salgadjén','Um dia dentro da produção da Salgadjén: do recebimento dos insumos à expedição conferida.',5)
) AS v(cat, title, slug, excerpt, body, seot, seod, mins)
JOIN public.content_categories c ON c.slug = v.cat;

INSERT INTO public.pages (slug, title, subtitle, body, seo_title, seo_description) VALUES
 ('quem-somos','Quem somos','Empresa familiar desde 1988, com gestão profissional.','A Salgadjén nasceu em 1988 como uma produção familiar e cresceu sem terceirizar o que importa: a decisão, o cuidado e o atendimento.\n\nHoje somos uma equipe treinada, com processos documentados e estrutura própria de produção, congelamento e logística. Mas quem responde pelo seu evento continua tendo nome e telefone.','Quem somos | Salgadjén','Conheça a Salgadjén: empresa familiar fundada em 1988, especialista em soluções gastronômicas para eventos.'),
 ('experiencia','A experiência Salgadjén','O que realmente se contrata quando se contrata a gente.','Quem organiza um evento não quer salgado. Quer dormir tranquilo na véspera.\n\nNossa entrega começa muito antes da comida chegar: no briefing bem feito, no cronograma combinado, na pessoa que responde quando você liga. Os produtos são a parte visível de um trabalho que existe para que nada dê errado.','A experiência Salgadjén','Mais do que produtos: a Salgadjén entrega tranquilidade a quem organiza eventos há 38 anos.'),
 ('grandes-eventos','Grandes Eventos','Volume alto, padrão constante.','Grandes eventos não perdoam improviso. Por isso trabalhamos com planejamento de produção dedicado, cronograma de reposição, equipe alocada e responsável nominal pelo evento.\n\nDo camarote ao evento corporativo de milhares de convidados, a operação é desenhada antes e acompanhada durante.','Grandes eventos | Salgadjén','Estrutura, planejamento e equipe dedicada para grandes eventos corporativos e de entretenimento.');
