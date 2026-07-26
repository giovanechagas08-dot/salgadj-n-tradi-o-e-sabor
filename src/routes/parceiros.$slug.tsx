import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { getPartner } from "@/lib/site.functions";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHeading } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";

export const Route = createFileRoute("/parceiros/$slug")({
  loader: async ({ params }) => {
    const data = await getPartner({ data: { slug: params.slug } });
    if (!data) throw notFound();
    return data;
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Case não encontrado — Salgadjén" }, { name: "robots", content: "noindex" }] };
    }
    const { partner } = loaderData;
    const title = partner.seo_title ?? `${partner.name} — Case de parceria | Salgadjén`;
    const description = partner.seo_description ?? partner.summary ?? "Case de parceria Salgadjén.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/parceiros/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/parceiros/${params.slug}` }],
    };
  },
  errorComponent: () => (
    <Section tone="white">
      <p className="text-muted-foreground">Não foi possível carregar este case.</p>
    </Section>
  ),
  notFoundComponent: () => (
    <Section tone="white">
      <SectionHeading title="Case não encontrado" description="O conteúdo pode ter sido movido." />
      <Link to="/parceiros" className="mt-8 inline-flex text-sm font-semibold text-brand-purple">
        Ver todos os parceiros
      </Link>
    </Section>
  ),
  component: PartnerPage,
});

function PartnerPage() {
  const { partner, media, testimonials } = Route.useLoaderData();
  const blocks = [
    { label: "Desafio", text: partner.challenge },
    { label: "Solução", text: partner.solution },
    { label: "Resultado", text: partner.result },
  ].filter((b) => b.text);

  return (
    <>
      <PageHero
        eyebrow={partner.segment ?? "Parceiro"}
        title={partner.name}
        subtitle={partner.summary}
        image={partner.cover_url}
      />

      <Section tone="white">
        <Link
          to="/parceiros"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-purple"
        >
          <ArrowLeft className="size-4" />
          Todos os parceiros
        </Link>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {blocks.map((block, i) => (
            <Reveal key={block.label} delay={i * 0.08}>
              <div className="h-full rounded-3xl bg-background p-8">
                <p className="eyebrow text-brand-yellow">{block.label}</p>
                <p className="mt-4 leading-relaxed text-brand-purple-deep">{block.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {partner.partnership_story ? (
          <Reveal className="mt-16 max-w-3xl">
            <SectionHeading eyebrow="A parceria" title="Como trabalhamos juntos" />
            <p className="mt-6 leading-relaxed text-muted-foreground md:text-lg">
              {partner.partnership_story}
            </p>
          </Reveal>
        ) : null}
      </Section>

      {media.length ? (
        <Section tone="cream">
          <div className="grid gap-6 md:grid-cols-3">
            {media.map((item: { id: string; url: string; caption: string | null }) => (
              <img
                key={item.id}
                src={item.url}
                alt={item.caption ?? partner.name}
                loading="lazy"
                className="aspect-[4/3] w-full rounded-3xl object-cover"
              />
            ))}
          </div>
        </Section>
      ) : null}

      {testimonials.length ? (
        <Section tone="purple">
          {testimonials.map((item: { id: string; quote: string; author_name: string; author_role: string | null }) => (
            <figure key={item.id} className="mx-auto max-w-3xl text-center">
              <blockquote className="type-h2 text-brand-cream">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-6 text-sm text-brand-yellow">
                {item.author_name}
                {item.author_role ? ` · ${item.author_role}` : ""}
              </figcaption>
            </figure>
          ))}
        </Section>
      ) : null}
    </>
  );
}
