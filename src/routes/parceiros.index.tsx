import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { getPartners } from "@/lib/site.functions";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHeading } from "@/components/site/section";
import { Prose } from "@/components/site/prose";
import { Reveal } from "@/components/site/reveal";
import eventosImg from "@/assets/grandes-eventos.jpg";

const partnersQuery = queryOptions({
  queryKey: ["partners"],
  queryFn: () => getPartners(),
});

export const Route = createFileRoute("/parceiros/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(partnersQuery),
  head: () => ({
    meta: [
      { title: "Parceiros e cases — Salgadjén" },
      {
        name: "description",
        content:
          "Buffets, casas de festas e empresas que integraram a Salgadjén à própria operação. Conheça os desafios e as soluções de cada parceria.",
      },
      { property: "og:title", content: "Parceiros e cases — Salgadjén" },
      {
        property: "og:description",
        content: "Quem confia a própria reputação à nossa.",
      },
      { property: "og:url", content: "/parceiros" },
    ],
    links: [{ rel: "canonical", href: "/parceiros" }],
  }),
  component: ParceirosPage,
});

function ParceirosPage() {
  const { data } = useSuspenseQuery(partnersQuery);
  const { page, partners } = data;

  return (
    <>
      <PageHero
        eyebrow="Parceiros"
        title={page?.title ?? "Parceiros"}
        subtitle={page?.subtitle}
        image={data.hero?.image_url ?? eventosImg}
      />

      <Section tone="white">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <SectionHeading eyebrow="Parcerias" title="Fornecer é fácil. Sustentar é o desafio." />
          <Reveal delay={0.1}>
            <Prose text={page?.body} />
          </Reveal>
        </div>
      </Section>

      <Section tone="cream">
        <div className="grid gap-8 lg:grid-cols-2">
          {partners.map((partner, i) => (
            <Reveal key={partner.id} delay={i * 0.06}>
              <Link
                to="/parceiros/$slug"
                params={{ slug: partner.slug }}
                className="group flex h-full flex-col rounded-3xl bg-card p-10 transition-shadow hover:shadow-raised"
              >
                <p className="eyebrow text-brand-yellow">{partner.segment}</p>
                <h2 className="type-h3 mt-4 text-brand-purple-deep">{partner.name}</h2>
                <p className="mt-4 flex-1 leading-relaxed text-muted-foreground">
                  {partner.summary}
                </p>
                {partner.challenge ? (
                  <div className="mt-8 rounded-2xl bg-background p-6">
                    <p className="eyebrow text-brand-purple/60">Desafio</p>
                    <p className="mt-3 type-body-sm text-brand-purple-deep">
                      {partner.challenge}
                    </p>
                  </div>
                ) : null}
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-purple">
                  Ver o case completo
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="purple">
        <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
          <SectionHeading
            eyebrow="Seja um parceiro"
            title="Quer atender seus clientes com um fornecedor previsível?"
            description="Trabalhamos com condições específicas para buffets, casas de festas e operações recorrentes."
            invert
          />
          <div className="lg:justify-self-end">
            <Link
              to="/contato"
              className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-7 py-4 text-sm font-semibold text-brand-purple-deep"
            >
              Falar sobre parceria
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
