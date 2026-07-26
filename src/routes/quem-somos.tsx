import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { getPage } from "@/lib/site.functions";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHeading } from "@/components/site/section";
import { Prose } from "@/components/site/prose";
import { Reveal } from "@/components/site/reveal";
import producaoImg from "@/assets/producao.jpg";

const pageQuery = queryOptions({
  queryKey: ["page", "quem-somos"],
  queryFn: () => getPage({ data: { slug: "quem-somos" } }),
});

export const Route = createFileRoute("/quem-somos")({
  loader: ({ context }) => context.queryClient.ensureQueryData(pageQuery),
  head: () => ({
    meta: [
      { title: "Quem somos — Salgadjén, empresa familiar desde 1988" },
      {
        name: "description",
        content:
          "Empresa familiar com gestão profissional: conheça a Salgadjén, sua equipe e a forma de trabalhar construída em quase quatro décadas.",
      },
      { property: "og:title", content: "Quem somos — Salgadjén" },
      {
        property: "og:description",
        content: "Empresa familiar desde 1988, com gestão profissional e atendimento próximo.",
      },
      { property: "og:url", content: "/quem-somos" },
    ],
    links: [{ rel: "canonical", href: "/quem-somos" }],
  }),
  component: QuemSomosPage,
});

const VALUES = [
  {
    title: "Decisão na família",
    text: "Quem responde pela empresa é quem fundou e quem cresceu dentro dela. Isso encurta caminhos e evita respostas vazias.",
  },
  {
    title: "Gestão profissional",
    text: "Processos escritos, controles de produção e equipe treinada. Tradição não é desculpa para informalidade.",
  },
  {
    title: "Relação de longo prazo",
    text: "Nossos maiores clientes estão conosco há mais de uma década. Trabalhamos para o próximo evento, não para a próxima venda.",
  },
];

function QuemSomosPage() {
  const { data } = useSuspenseQuery(pageQuery);
  const page = data.page;

  return (
    <>
      <PageHero
        eyebrow="Quem somos"
        title={page?.title ?? "Quem somos"}
        subtitle={page?.subtitle}
        image={data.hero?.image_url ?? producaoImg}
      />

      <Section tone="white">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <SectionHeading eyebrow="A empresa" title="Empresa familiar, gestão profissional." />
          <Reveal delay={0.1}>
            <Prose text={page?.body} />
          </Reveal>
        </div>
      </Section>

      <Section tone="cream">
        <SectionHeading eyebrow="Como pensamos" title="Três compromissos que não negociamos." />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {VALUES.map((value, i) => (
            <Reveal key={value.title} delay={i * 0.08}>
              <div className="h-full rounded-3xl bg-card p-8">
                <p className="font-display text-lg text-brand-yellow">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 text-xl text-brand-purple-deep">{value.title}</h3>
                <p className="mt-3 type-body-sm text-muted-foreground">{value.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="purple">
        <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
          <SectionHeading
            eyebrow="Próximo capítulo"
            title="Uma estrutura dimensionada para não falhar."
            invert
          />
          <div className="lg:justify-self-end">
            <Link
              to="/estrutura"
              className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-7 py-4 text-sm font-semibold text-brand-purple-deep"
            >
              Ver nossa estrutura
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
