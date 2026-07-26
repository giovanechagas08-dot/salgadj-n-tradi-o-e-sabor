import { publicClient } from "./supabase-public.server";

const ORDER = { ascending: true } as const;

export async function loadHome() {
  const sb = publicClient();
  const [hero, sections, stats, differentials, steps, timeline, partners, testimonials, settings] =
    await Promise.all([
      sb.from("heroes").select("*").eq("page_slug", "home").eq("is_active", true).maybeSingle(),
      sb.from("home_sections").select("*").eq("is_active", true).order("display_order", ORDER),
      sb.from("stats").select("*").eq("is_active", true).order("display_order", ORDER),
      sb.from("differentials").select("*").eq("is_active", true).order("display_order", ORDER),
      sb.from("process_steps").select("*").eq("is_active", true).order("step_number", ORDER),
      sb.from("timeline_events").select("*").eq("is_active", true).order("display_order", ORDER),
      sb
        .from("partners")
        .select("*")
        .eq("is_published", true)
        .order("display_order", ORDER)
        .limit(8),
      sb
        .from("testimonials")
        .select("*")
        .eq("is_published", true)
        .order("display_order", ORDER)
        .limit(6),
      sb.from("site_settings").select("key,value"),
    ]);

  return {
    hero: hero.data ?? null,
    sections: sections.data ?? [],
    stats: stats.data ?? [],
    differentials: differentials.data ?? [],
    steps: steps.data ?? [],
    timeline: timeline.data ?? [],
    partners: partners.data ?? [],
    testimonials: testimonials.data ?? [],
    settings: settingsMap(settings.data),
  };
}

export function settingsMap(rows: { key: string; value: unknown }[] | null) {
  const map: Record<string, string> = {};
  for (const row of rows ?? []) {
    map[row.key] = typeof row.value === "string" ? row.value : JSON.stringify(row.value ?? "");
  }
  return map;
}

export async function loadSettings() {
  const sb = publicClient();
  const { data } = await sb.from("site_settings").select("key,value");
  return settingsMap(data);
}

export async function loadPage(slug: string) {
  const sb = publicClient();
  const [page, hero] = await Promise.all([
    sb.from("pages").select("*").eq("slug", slug).eq("is_published", true).maybeSingle(),
    sb.from("heroes").select("*").eq("page_slug", slug).eq("is_active", true).maybeSingle(),
  ]);
  return { page: page.data ?? null, hero: hero.data ?? null };
}

export async function loadHistoria() {
  const sb = publicClient();
  const [base, timeline, stats] = await Promise.all([
    loadPage("historia"),
    sb.from("timeline_events").select("*").eq("is_active", true).order("display_order", ORDER),
    sb.from("stats").select("*").eq("is_active", true).order("display_order", ORDER),
  ]);
  return { ...base, timeline: timeline.data ?? [], stats: stats.data ?? [] };
}

export async function loadEstrutura() {
  const sb = publicClient();
  const [base, sections] = await Promise.all([
    loadPage("estrutura"),
    sb.from("structure_sections").select("*").eq("is_active", true).order("display_order", ORDER),
  ]);
  return { ...base, sections: sections.data ?? [] };
}

export async function loadProcessos() {
  const sb = publicClient();
  const [base, steps] = await Promise.all([
    loadPage("processos"),
    sb.from("process_steps").select("*").eq("is_active", true).order("step_number", ORDER),
  ]);
  return { ...base, steps: steps.data ?? [] };
}

export async function loadDiferenciais() {
  const sb = publicClient();
  const [base, items, testimonials] = await Promise.all([
    loadPage("diferenciais"),
    sb.from("differentials").select("*").eq("is_active", true).order("display_order", ORDER),
    sb
      .from("testimonials")
      .select("*")
      .eq("is_published", true)
      .order("display_order", ORDER),
  ]);
  return { ...base, items: items.data ?? [], testimonials: testimonials.data ?? [] };
}

export async function loadPartners() {
  const sb = publicClient();
  const [base, partners] = await Promise.all([
    loadPage("parceiros"),
    sb.from("partners").select("*").eq("is_published", true).order("display_order", ORDER),
  ]);
  return { ...base, partners: partners.data ?? [] };
}

export async function loadPartner(slug: string) {
  const sb = publicClient();
  const { data: partner } = await sb
    .from("partners")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (!partner) return null;
  const [media, testimonials] = await Promise.all([
    sb.from("partner_media").select("*").eq("partner_id", partner.id).order("display_order", ORDER),
    sb.from("testimonials").select("*").eq("partner_id", partner.id).eq("is_published", true),
  ]);
  return { partner, media: media.data ?? [], testimonials: testimonials.data ?? [] };
}

export async function loadCatalog() {
  const sb = publicClient();
  const [base, categories, products] = await Promise.all([
    loadPage("produtos"),
    sb.from("categories").select("*").eq("is_active", true).order("display_order", ORDER),
    sb
      .from("products")
      .select("*")
      .eq("is_published", true)
      .order("display_order", ORDER),
  ]);
  return { ...base, categories: categories.data ?? [], products: products.data ?? [] };
}

export async function loadProduct(slug: string) {
  const sb = publicClient();
  const { data: product } = await sb
    .from("products")
    .select("*, categories(name,slug)")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (!product) return null;
  const [faqs, prices, related, flavors, parent] = await Promise.all([
    sb.from("product_faqs").select("*").eq("product_id", product.id).order("display_order", ORDER),
    sb
      .from("product_prices")
      .select("*, price_tables(name,slug,audience,is_public)")
      .eq("product_id", product.id),
    sb
      .from("products")
      .select("id,name,slug,short_description,image_url")
      .eq("is_published", true)
      .eq("is_group", product.is_group ?? false)
      .eq("category_id", product.category_id ?? "")
      .neq("id", product.id)
      .limit(3),
    product.is_group
      ? sb
          .from("products")
          .select("*")
          .eq("parent_id", product.id)
          .eq("is_published", true)
          .order("display_order", ORDER)
      : Promise.resolve({ data: [] as never[] }),
    product.parent_id
      ? sb
          .from("products")
          .select("id,name,slug,quote_unit,qty_step,min_qty_per_flavor")
          .eq("id", product.parent_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);
  return {
    product,
    faqs: faqs.data ?? [],
    prices: (prices.data ?? []).filter((p) => p.price_tables?.is_public),
    related: related.data ?? [],
    flavors: flavors.data ?? [],
    parent: parent.data ?? null,
  };
}

export async function loadPriceTables() {
  const sb = publicClient();
  const [base, tables, categories, products, prices] = await Promise.all([
    loadPage("tabela-de-valores"),
    sb
      .from("price_tables")
      .select("*")
      .eq("is_active", true)
      .eq("is_public", true)
      .order("display_order", ORDER),
    sb.from("categories").select("*").eq("is_active", true).order("display_order", ORDER),
    sb.from("products").select("*").eq("is_published", true).order("display_order", ORDER),
    sb.from("product_prices").select("*"),
  ]);
  return {
    ...base,
    tables: tables.data ?? [],
    categories: categories.data ?? [],
    products: products.data ?? [],
    prices: prices.data ?? [],
  };
}

export async function loadGallery() {
  const sb = publicClient();
  const [base, categories, items] = await Promise.all([
    loadPage("galeria"),
    sb.from("gallery_categories").select("*").eq("is_active", true).order("display_order", ORDER),
    sb
      .from("gallery_items")
      .select("*")
      .eq("is_published", true)
      .order("display_order", ORDER),
  ]);
  return { ...base, categories: categories.data ?? [], items: items.data ?? [] };
}

export async function loadPosts() {
  const sb = publicClient();
  const [base, categories, posts] = await Promise.all([
    loadPage("conteudos"),
    sb.from("content_categories").select("*").order("display_order", ORDER),
    sb
      .from("content_posts")
      .select("*, content_categories(name,slug)")
      .eq("is_published", true)
      .order("published_at", { ascending: false }),
  ]);
  return { ...base, categories: categories.data ?? [], posts: posts.data ?? [] };
}

export async function loadPost(slug: string) {
  const sb = publicClient();
  const { data: post } = await sb
    .from("content_posts")
    .select("*, content_categories(name,slug)")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (!post) return null;
  const { data: more } = await sb
    .from("content_posts")
    .select("id,title,slug,excerpt,cover_url")
    .eq("is_published", true)
    .neq("id", post.id)
    .limit(3);
  return { post, more: more ?? [] };
}

export async function loadQuoteCatalog() {
  const sb = publicClient();
  const [base, categories, products] = await Promise.all([
    loadPage("orcamento"),
    sb.from("categories").select("*").eq("is_active", true).order("display_order", ORDER),
    sb
      .from("products")
      .select("id,name,slug,unit,image_url,category_id,short_description")
      .eq("is_published", true)
      .eq("is_available", true)
      .order("display_order", ORDER),
  ]);
  return { ...base, categories: categories.data ?? [], products: products.data ?? [] };
}

export type QuoteInput = {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  city?: string;
  event_type?: string;
  event_date?: string;
  guests?: number;
  message?: string;
  items: { product_id: string; product_name: string; quantity: number; unit: string }[];
};

export async function createQuote(input: QuoteInput) {
  const sb = publicClient();
  const { data, error } = await sb.rpc("submit_quote", {
    _quote: {
      name: input.name,
      phone: input.phone,
      email: input.email ?? "",
      company: input.company ?? "",
      city: input.city ?? "",
      event_type: input.event_type ?? "",
      event_date: input.event_date ?? "",
      guests: input.guests != null ? String(input.guests) : "",
      message: input.message ?? "",
    },
    _items: input.items.map((item) => ({
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: String(item.quantity),
      unit: item.unit,
    })),
  });
  if (error) throw new Error(error.message);
  return { id: data as unknown as string };
}

export async function createContact(input: {
  name: string;
  email?: string;
  phone?: string;
  subject?: string;
  message: string;
}) {
  const sb = publicClient();
  const { error } = await sb.from("contacts").insert({
    name: input.name,
    email: input.email || null,
    phone: input.phone || null,
    subject: input.subject || null,
    message: input.message,
  });
  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function loadSitemapEntries() {
  const sb = publicClient();
  const [products, partners, posts] = await Promise.all([
    sb.from("products").select("slug,updated_at").eq("is_published", true),
    sb.from("partners").select("slug,updated_at").eq("is_published", true),
    sb.from("content_posts").select("slug,updated_at").eq("is_published", true),
  ]);
  return {
    products: products.data ?? [],
    partners: partners.data ?? [],
    posts: posts.data ?? [],
  };
}
