import { buttonVariants } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { motion } from "motion/react";
import { ArrowRight, Quote as QuoteIcon } from "lucide-react";
import { getHome } from "@/lib/site.functions";
import { BRAND, whatsappLink } from "@/lib/brand";
import { Reveal } from "@/components/site/reveal";
import { Section, SectionHeading } from "@/components/site/section";
import { cn } from "@/lib/utils";
import heroImg from "@/assets/hero-momentos.jpg";


const homeQuery = queryOptions({
  queryKey: ["home"],
  queryFn: () => getHome(),
});

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(homeQuery),
  head: () => ({
    meta: [
      { title: "Salgadjén — Há 38 anos fazendo parte dos melhores momentos" },
      {
        name: "description",
        content:
          "Empresa familiar fundada em 1988. Soluções gastronômicas para buffets, casas de festas, empresas e grandes eventos, com produção sob demanda e entrega pontual.",
      },
      { property: "og:title", content: "Salgadjén — Há 38 anos fazendo parte dos melhores momentos" },
      {
        property: "og:description",
        content:
          "Empresa familiar fundada em 1988. Soluções gastronômicas para buffets, casas de festas, empresas e grandes eventos, com produção sob demanda e entrega pontual.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  const { data } = useSuspenseQuery(homeQuery);
  const { hero, sections, stats, differentials, timeline, testimonials } = data;

  const bySlug = (slug: string) => sections.find((s) => s.slug === slug);
  const experiencia = bySlug("experiencia");
  const historia = bySlug("historia");
  const diferenciais = bySlug("diferenciais");
  const produtos = bySlug("produtos");

  return (
    <>
      {/* 1 — Hero */}
      <section className="relative isolate flex min-h-[92vh] items-end overflow-hidden bg-brand-ink pb-20 pt-40 text-brand-cream">
        <img
          src={hero?.image_url || heroImg}
          alt="Mesa de recepção com salgados finos servidos em um evento"
          width={1920}
          height={1280}
          className="absolute inset-0 -z-10 size-full object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 overlay-scrim" />

        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
            <p className="eyebrow text-brand-yellow">{hero?.eyebrow ?? "Desde 1988"}</p>
            <h1 className="type-hero-xl mt-6">{hero?.title ?? BRAND.tagline}</h1>
            <p className="mt-8 max-w-2xl type-lead text-brand-cream/80 md:text-xl">
              {hero?.subtitle ??
                "Soluções gastronômicas para buffets, casas de festas, empresas e grandes eventos."}
            </p>
            <div className="mt-12 flex flex-wrap gap-4">
              <Link to="/orcamento" className={buttonVariants({ variant: "secondary", size: "xl" })}>
                {hero?.primary_cta_label ?? "Solicitar orçamento"}
                <ArrowRight className="size-4" />
              </Link>
              <a
                href={whatsappLink(`Olá! Gostaria de falar com a ${BRAND.name}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "inverse", size: "xl" })}
              >
                {hero?.secondary_cta_label ?? "Falar no WhatsApp"}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2 — Números */}
      {stats.length ? (
        <section className="border-y border-border bg-card">
          <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
            {stats.slice(0, 4).map((stat, i) => (
              <Reveal key={stat.id} delay={i * 0.08}>
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
        </section>
      ) : null}

      {/* 3 — Experiência */}
      {experiencia ? (
        <Section tone="white">
          <div className="grid items-center gap-14 lg:grid-cols-[1fr_auto] lg:gap-20">
            <div>
              <SectionHeading
                eyebrow={experiencia.eyebrow ?? undefined}
                title={experiencia.title}
                description={experiencia.body ?? experiencia.subtitle}
              />
              <div className="mt-10">
                <SectionLink href="/experiencia" label="A experiência Salgadjén" />
              </div>
            </div>
          </div>
        </Section>
      ) : null}

      {/* 4 — História */}
      {historia ? (
        <Section tone="purple" rhythm="sm">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div>
              <SectionHeading
                eyebrow={historia.eyebrow ?? undefined}
                title={historia.title}
                description={historia.body ?? historia.subtitle}
                invert
              />
              <div className="mt-10">
                <SectionLink href="/historia" label="Nossa linha do tempo" invert />
              </div>
            </div>
            <ol className="relative border-l border-brand-cream/20 pl-8">
              {timeline.slice(0, 4).map((event, i) => (
                <Reveal key={event.id} delay={i * 0.06}>
                  <li className="relative pb-10 last:pb-0">
                    <span className="absolute -left-[38px] top-1.5 size-3 rounded-full bg-brand-yellow" />
                    <p className="type-h3 text-brand-yellow">{event.year}</p>
                    <h3 className="mt-1 text-lg text-brand-cream">{event.title}</h3>
                    <p className="mt-2 type-body-sm text-brand-cream/70">{event.description}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </Section>
      ) : null}

      {/* 5 — Diferenciais */}
      {diferenciais && differentials.length ? (
        <Section tone="purple" rhythm="sm">
          <SectionHeading
            eyebrow={diferenciais.eyebrow ?? undefined}
            title={diferenciais.title}
            description={diferenciais.subtitle}
            invert
          />
          <div className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-brand-cream/15 sm:grid-cols-2 lg:grid-cols-3">
            {differentials.slice(0, 6).map((item, i) => (
              <Reveal key={item.id} delay={i * 0.05}>
                <div className="h-full bg-brand-purple p-8">
                  <p className="font-display text-lg text-brand-yellow">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-4 text-xl text-brand-cream">{item.title}</h3>
                  <p className="mt-3 type-body-sm text-brand-cream/75">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-12">
            <SectionLink href="/diferenciais" label="Nossos diferenciais" invert />
          </div>
        </Section>
      ) : null}

      {/* 6 — Prova social */}
      {testimonials.length ? (
        <Section tone="cream">
          <SectionHeading
            eyebrow="Parceiros"
            title="Quem confia a própria reputação à nossa"
            align="center"
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.slice(0, 3).map((item, i) => (
              <Reveal key={item.id} delay={i * 0.08}>
                <figure className="flex h-full flex-col rounded-3xl border border-border bg-card p-8">
                  <QuoteIcon className="size-7 text-brand-yellow" />
                  <blockquote className="mt-6 flex-1 text-base leading-relaxed text-brand-purple-deep">
                    “{item.quote}”
                  </blockquote>
                  <figcaption className="mt-8 text-sm">
                    <span className="font-semibold text-brand-purple">{item.author_name}</span>
                    <span className="block text-muted-foreground">
                      {[item.author_role, item.company].filter(Boolean).join(" · ")}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <SectionLink href="/parceiros" label="Ver cases" />
          </div>
        </Section>
      ) : null}

      {/* 7 — Produtos */}
      <Section tone="white">
        <div className="grid items-end gap-10 lg:grid-cols-[1.3fr_1fr]">
          <SectionHeading
            eyebrow={produtos?.eyebrow ?? "Produtos"}
            title={produtos?.title ?? "Agora sim, o que servimos."}
            description={
              produtos?.subtitle ??
              "Salgados fritos e assados, doces e refeições produzidos sob demanda, com ingredientes selecionados e padrão constante do primeiro ao último item."
            }
          />
          <div className="flex flex-wrap gap-6 lg:justify-end">
            <SectionLink href="/produtos" label="Ver produtos" />
            <SectionLink href="/tabela-de-valores" label="Tabela de valores" />
          </div>
        </div>
      </Section>

      {/* 8 — CTA final */}
      <Section tone="yellow">
        <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <p className="eyebrow text-brand-purple-deep/70">Próximo passo</p>
            <h2 className="type-display mt-5 max-w-2xl text-brand-purple-deep">
              Conte o que você está organizando. Cuidamos do resto.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-wrap gap-4 lg:justify-end">
            <Link to="/orcamento" className={buttonVariants({ variant: "primary", size: "xl" })}>
              Montar meu orçamento
              <ArrowRight className="size-4" />
            </Link>
            <Link to="/contato" className={buttonVariants({ variant: "outline", size: "xl" })}>
              Falar com a equipe
            </Link>
          </Reveal>
        </div>
      </Section>
    </>
  );
}

function SectionLink({
  href,
  label,
  invert,
}: {
  href: string;
  label?: string | null;
  invert?: boolean;
}) {
  return (
    <Link
      to={href as never}
      className={cn(
        "group inline-flex items-center gap-2 text-sm font-semibold",
        invert ? "text-brand-yellow" : "text-brand-purple",
      )}
    >
      {label ?? "Saiba mais"}
      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}
