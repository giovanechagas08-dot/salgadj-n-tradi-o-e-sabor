import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Quote as QuoteIcon } from "lucide-react";
import { getDiferenciais } from "@/lib/site.functions";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHeading } from "@/components/site/section";
import { Prose } from "@/components/site/prose";
import { Reveal } from "@/components/site/reveal";
import heroImg from "@/assets/hero-momentos.jpg";

const diferenciaisQuery = queryOptions({
  queryKey: ["diferenciais"],
  queryFn: () => getDiferenciais(),
});

export const Route = createFileRoute("/diferenciais")({
  loader: ({ context }) => context.queryClient.ensureQueryData(diferenciaisQuery),
  head: () => ({
    meta: [
      { title: "Diferenciais — Salgadjén" },
      {
        name: "description",
        content:
          "Empresa familiar, produção sob demanda, produtos bem recheados, atendimento próximo e estrutura para grandes eventos.",
      },
      { property: "og:title", content: "Diferenciais — Salgadjén" },
      {
        property: "og:description",
        content: "O que sustenta 38 anos de recorrência com buffets, empresas e famílias.",
      },
      { property: "og:url", content: "/diferenciais" },
    ],
    links: [{ rel: "canonical", href: "/diferenciais" }],
  }),
  component: DiferenciaisPage,
});

function DiferenciaisPage() {
  const { data } = useSuspenseQuery(diferenciaisQuery);
  const { page, items, testimonials } = data;

  return (
    <>
      <PageHero
        eyebrow="Diferenciais"
        title={page?.title ?? "Diferenciais"}
        subtitle={page?.subtitle}
        image={data.hero?.image_url ?? heroImg}
      />

      <Section tone="white">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <SectionHeading eyebrow="Na prática" title="Práticas mantidas, não promessas." />
          <Reveal delay={0.1}>
            <Prose text={page?.body} />
          </Reveal>
        </div>
      </Section>

      <Section tone="cream">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.05}>
              <div className="h-full rounded-3xl bg-card p-8">
                <p className="font-display text-lg text-brand-yellow">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 text-xl text-brand-purple-deep">{item.title}</h3>
                <p className="mt-3 type-body-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {testimonials.length ? (
        <Section tone="purple">
          <SectionHeading eyebrow="Depoimentos" title="Quem já contou com a gente." invert />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {testimonials.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.06}>
                <figure className="flex h-full flex-col rounded-3xl border border-brand-cream/15 p-8">
                  <QuoteIcon className="size-6 text-brand-yellow" />
                  <blockquote className="mt-6 flex-1 leading-relaxed text-brand-cream/90">
                    “{item.quote}”
                  </blockquote>
                  <figcaption className="mt-8 text-sm">
                    <span className="font-semibold text-brand-yellow">{item.author_name}</span>
                    <span className="block text-brand-cream/60">
                      {[item.author_role, item.company].filter(Boolean).join(" · ")}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      <Section tone="white">
        <div className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-brand-yellow p-10 md:flex-row md:items-center md:p-14">
          <h2 className="type-h2 max-w-xl text-brand-purple-deep">
            Veja como isso funciona dentro da operação dos nossos parceiros.
          </h2>
          <Link
            to="/parceiros"
            className="inline-flex items-center gap-2 rounded-full bg-brand-purple px-7 py-4 text-sm font-semibold text-brand-cream"
          >
            Ver cases
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
