import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { getProcessos } from "@/lib/site.functions";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHeading } from "@/components/site/section";
import { Prose } from "@/components/site/prose";
import { Reveal } from "@/components/site/reveal";
import producaoImg from "@/assets/producao.jpg";

const processosQuery = queryOptions({
  queryKey: ["processos"],
  queryFn: () => getProcessos(),
});

export const Route = createFileRoute("/processos")({
  loader: ({ context }) => context.queryClient.ensureQueryData(processosQuery),
  head: () => ({
    meta: [
      { title: "Processos de produção — Salgadjén" },
      {
        name: "description",
        content:
          "Produção sob demanda com etapas conferidas: recebimento, preparo, montagem, congelamento, conferência e entrega no evento.",
      },
      { property: "og:title", content: "Nossos processos — Salgadjén" },
      {
        property: "og:description",
        content: "Do pedido à entrega, cada etapa registrada e conferida.",
      },
      { property: "og:url", content: "/processos" },
    ],
    links: [{ rel: "canonical", href: "/processos" }],
  }),
  component: ProcessosPage,
});

function ProcessosPage() {
  const { data } = useSuspenseQuery(processosQuery);
  const { page, steps } = data;

  return (
    <>
      <PageHero
        eyebrow="Processos"
        title={page?.title ?? "Nossos processos"}
        subtitle={page?.subtitle}
        image={data.hero?.image_url ?? producaoImg}
      />

      <Section tone="white">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <SectionHeading
            eyebrow="Produção sob demanda"
            title="Nada é produzido para estoque."
          />
          <Reveal delay={0.1}>
            <Prose text={page?.body} />
          </Reveal>
        </div>
      </Section>

      <Section tone="cream">
        <ol className="grid gap-px overflow-hidden rounded-3xl bg-border md:grid-cols-2">
          {steps.map((step, i) => (
            <Reveal key={step.id} delay={i * 0.05}>
              <li className="h-full bg-card p-8 md:p-10">
                <p className="font-display text-4xl text-brand-yellow">
                  {String(step.step_number).padStart(2, "0")}
                </p>
                <h3 className="mt-4 text-xl text-brand-purple-deep">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section tone="purple">
        <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
          <SectionHeading
            eyebrow="Próximo capítulo"
            title="O que esse processo produz na prática."
            invert
          />
          <div className="lg:justify-self-end">
            <Link
              to="/diferenciais"
              className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-7 py-4 text-sm font-semibold text-brand-purple-deep"
            >
              Nossos diferenciais
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
