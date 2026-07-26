import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, CalendarCheck, HeartHandshake, ShieldCheck } from "lucide-react";
import { getPage } from "@/lib/site.functions";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHeading } from "@/components/site/section";
import { Prose } from "@/components/site/prose";
import { Reveal } from "@/components/site/reveal";
import heroImg from "@/assets/hero-momentos.jpg";

const pageQuery = queryOptions({
  queryKey: ["page", "experiencia"],
  queryFn: () => getPage({ data: { slug: "experiencia" } }),
});

export const Route = createFileRoute("/experiencia")({
  loader: ({ context }) => context.queryClient.ensureQueryData(pageQuery),
  head: () => ({
    meta: [
      { title: "A experiência Salgadjén — tranquilidade para quem organiza" },
      {
        name: "description",
        content:
          "Quem contrata a Salgadjén contrata previsibilidade: atendimento próximo, produção sob demanda e entrega pontual em cada evento.",
      },
      { property: "og:title", content: "A experiência Salgadjén" },
      {
        property: "og:description",
        content: "O que realmente se contrata quando se contrata a Salgadjén.",
      },
      { property: "og:url", content: "/experiencia" },
    ],
    links: [{ rel: "canonical", href: "/experiencia" }],
  }),
  component: ExperienciaPage,
});

const PILLARS = [
  {
    icon: HeartHandshake,
    title: "Atendimento que responde",
    text: "Uma pessoa acompanha seu evento do primeiro contato à entrega. Sem transferir você de setor em setor.",
  },
  {
    icon: CalendarCheck,
    title: "Pontualidade tratada como produto",
    text: "Cronograma definido na contratação e cumprido. Em evento, atraso não tem correção possível.",
  },
  {
    icon: ShieldCheck,
    title: "Padrão que não oscila",
    text: "O mesmo recheio, o mesmo tamanho e o mesmo sabor em 200 ou em 8.000 unidades.",
  },
];

function ExperienciaPage() {
  const { data } = useSuspenseQuery(pageQuery);
  const page = data.page;

  return (
    <>
      <PageHero
        eyebrow="Experiência"
        title={page?.title ?? "A experiência Salgadjén"}
        subtitle={page?.subtitle}
        image={data.hero?.image_url ?? heroImg}
      />

      <Section tone="white">
        <div className="grid gap-16 lg:grid-cols-[1fr_1fr]">
          <SectionHeading
            eyebrow="O que se contrata"
            title="Antes da comida, entregamos previsibilidade."
          />
          <Reveal delay={0.1}>
            <Prose text={page?.body} />
          </Reveal>
        </div>
      </Section>

      <Section tone="cream">
        <div className="grid gap-6 md:grid-cols-3">
          {PILLARS.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 0.08}>
              <div className="h-full rounded-3xl bg-card p-8">
                <pillar.icon className="size-7 text-brand-yellow" />
                <h3 className="mt-6 text-xl text-brand-purple-deep">{pillar.title}</h3>
                <p className="mt-3 type-body-sm text-muted-foreground">{pillar.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="purple">
        <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
          <SectionHeading
            eyebrow="Próximo capítulo"
            title="Essa forma de trabalhar tem uma origem."
            description="Ela começou em 1988, em uma cozinha de casa."
            invert
          />
          <div className="lg:justify-self-end">
            <Link
              to="/historia"
              className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-7 py-4 text-sm font-semibold text-brand-purple-deep"
            >
              Conhecer nossa história
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
