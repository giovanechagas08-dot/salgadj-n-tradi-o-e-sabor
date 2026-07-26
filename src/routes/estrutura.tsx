import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { getEstrutura } from "@/lib/site.functions";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHeading } from "@/components/site/section";
import { Prose } from "@/components/site/prose";
import { Reveal } from "@/components/site/reveal";
import producaoImg from "@/assets/producao.jpg";

const estruturaQuery = queryOptions({
  queryKey: ["estrutura"],
  queryFn: () => getEstrutura(),
});

export const Route = createFileRoute("/estrutura")({
  loader: ({ context }) => context.queryClient.ensureQueryData(estruturaQuery),
  head: () => ({
    meta: [
      { title: "Estrutura e capacidade produtiva — Salgadjén" },
      {
        name: "description",
        content:
          "Cozinha industrial, cadeia de frio, logística e controle de qualidade: a estrutura que sustenta entregas pontuais em eventos de qualquer porte.",
      },
      { property: "og:title", content: "Nossa estrutura — Salgadjén" },
      {
        property: "og:description",
        content: "Capacidade instalada, logística e controle para eventos de qualquer porte.",
      },
      { property: "og:url", content: "/estrutura" },
    ],
    links: [{ rel: "canonical", href: "/estrutura" }],
  }),
  component: EstruturaPage,
});

function EstruturaPage() {
  const { data } = useSuspenseQuery(estruturaQuery);
  const { page, sections } = data;

  return (
    <>
      <PageHero
        eyebrow="Estrutura"
        title={page?.title ?? "Nossa estrutura"}
        subtitle={page?.subtitle}
        image={data.hero?.image_url ?? producaoImg}
      />

      <Section tone="white">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <SectionHeading
            eyebrow="Por que importa"
            title="Estrutura é o que transforma promessa em previsibilidade."
          />
          <Reveal delay={0.1}>
            <Prose text={page?.body} />
          </Reveal>
        </div>
      </Section>

      <Section tone="cream">
        <div className="grid gap-6 md:grid-cols-2">
          {sections.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.06}>
              <article className="flex h-full flex-col rounded-3xl bg-card p-8 md:p-10">
                <h3 className="text-xl text-brand-purple-deep md:text-2xl">{item.title}</h3>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {item.description}
                </p>
                {item.metric_value ? (
                  <div className="mt-8 border-t border-border pt-6">
                    <p className="font-display text-3xl text-brand-purple">{item.metric_value}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.metric_label}</p>
                  </div>
                ) : null}
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="purple">
        <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
          <SectionHeading
            eyebrow="Próximo capítulo"
            title="Estrutura sem processo é só espaço vazio."
            invert
          />
          <div className="lg:justify-self-end">
            <Link
              to="/processos"
              className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-7 py-4 text-sm font-semibold text-brand-purple-deep"
            >
              Conhecer os processos
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
