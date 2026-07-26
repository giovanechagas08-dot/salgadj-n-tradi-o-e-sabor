import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { getHistoria } from "@/lib/site.functions";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHeading } from "@/components/site/section";
import { Prose } from "@/components/site/prose";
import { Reveal } from "@/components/site/reveal";
import historiaImg from "@/assets/historia.jpg";

const historiaQuery = queryOptions({
  queryKey: ["historia"],
  queryFn: () => getHistoria(),
});

export const Route = createFileRoute("/historia")({
  loader: ({ context }) => context.queryClient.ensureQueryData(historiaQuery),
  head: () => ({
    meta: [
      { title: "História da Salgadjén — uma empresa familiar desde 1988" },
      {
        name: "description",
        content:
          "De uma cozinha de casa em 1988 a uma operação que atende grandes eventos: conheça a trajetória da Salgadjén.",
      },
      { property: "og:title", content: "História da Salgadjén — desde 1988" },
      {
        property: "og:description",
        content: "38 anos de trajetória de uma empresa familiar de soluções gastronômicas.",
      },
      { property: "og:url", content: "/historia" },
    ],
    links: [{ rel: "canonical", href: "/historia" }],
  }),
  component: HistoriaPage,
});

function HistoriaPage() {
  const { data } = useSuspenseQuery(historiaQuery);
  const { page, timeline, stats } = data;

  return (
    <>
      <PageHero
        eyebrow="1988 → hoje"
        title={page?.title ?? "Nossa história"}
        subtitle={page?.subtitle}
        image={data.hero?.image_url ?? historiaImg}
      />

      <Section tone="white">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="overflow-hidden rounded-3xl">
              <img
                src={historiaImg}
                alt="Duas gerações preparando salgados em uma cozinha familiar"
                width={1600}
                height={1088}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </Reveal>
          <div>
            <SectionHeading eyebrow="Origem" title="Começou com uma família e uma cozinha." />
            <div className="mt-8">
              <Prose text={page?.body} />
            </div>
          </div>
        </div>
      </Section>

      <Section tone="purple">
        <SectionHeading eyebrow="Linha do tempo" title="Trinta e oito anos, um passo por vez." invert />
        <ol className="mt-16 grid gap-10 md:grid-cols-2">
          {timeline.map((event, i) => (
            <Reveal key={event.id} delay={i * 0.05}>
              <li className="relative rounded-3xl border border-brand-cream/15 p-8">
                <p className="type-h2 text-brand-yellow">{event.year}</p>
                <h3 className="mt-3 text-xl text-brand-cream">{event.title}</h3>
                <p className="mt-3 type-body-sm text-brand-cream/75">
                  {event.description}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      {stats.length ? (
        <Section tone="cream">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <Reveal key={stat.id} delay={i * 0.06}>
                <p className="type-display text-brand-purple">
                  {stat.prefix ?? ""}
                  {stat.value.toLocaleString("pt-BR")}
                  {stat.suffix ?? ""}
                </p>
                <p className="mt-3 text-sm font-semibold text-brand-purple-deep">{stat.label}</p>
                {stat.description ? (
                  <p className="mt-1 text-sm text-muted-foreground">{stat.description}</p>
                ) : null}
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      <Section tone="white">
        <div className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-brand-purple p-10 md:flex-row md:items-center md:p-14">
          <div>
            <p className="eyebrow text-brand-yellow">Próximo capítulo</p>
            <h2 className="type-h2 mt-4 max-w-xl text-brand-cream">
              Quem conduz a empresa hoje.
            </h2>
          </div>
          <Link
            to="/quem-somos"
            className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-7 py-4 text-sm font-semibold text-brand-purple-deep"
          >
            Quem somos
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
