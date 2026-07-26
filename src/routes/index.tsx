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
import historiaImg from "@/assets/historia.jpg";
import producaoImg from "@/assets/producao.jpg";
import eventosImg from "@/assets/grandes-eventos.jpg";

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

const SECTION_IMAGES: Record<string, string> = {
  historia: historiaImg,
  processos: producaoImg,
  "grandes-eventos": eventosImg,
  estrutura: producaoImg,
};

function HomePage() {
  const { data } = useSuspenseQuery(homeQuery);
  const { hero, sections, stats, differentials, timeline, partners, testimonials } = data;

  return (
    <>
      {/* Capítulo 0 — abertura */}
      <section className="relative isolate flex min-h-[92vh] items-end overflow-hidden bg-brand-ink pb-20 pt-40 text-brand-cream">
        <img
          src={hero?.image_url || heroImg}
          alt="Mesa de recepção com salgados finos servidos em um evento"
          width={1920}
          height={1280}
          className="absolute inset-0 -z-10 size-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 overlay-scrim"
        />

        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
            <p className="eyebrow text-brand-yellow">{hero?.eyebrow ?? "Desde 1988"}</p>
            <h1 className="type-hero-xl mt-6">
              {hero?.title ?? BRAND.tagline}
            </h1>
            <p className="mt-8 max-w-2xl type-lead text-brand-cream/80 md:text-xl">
              {hero?.subtitle ??
                "Soluções gastronômicas para buffets, casas de festas, empresas e grandes eventos."}
            </p>
            <div className="mt-12 flex flex-wrap gap-4">
              <Link
                to="/orcamento"
                className={buttonVariants({ variant: "secondary", size: "xl" })}
              >
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

      {/* Números */}
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

      {/* Capítulos narrativos */}
      {sections.map((section, index) => {
        const image = section.image_url || SECTION_IMAGES[section.slug];
        const purple = section.variant === "purple";
        const flipped = index % 2 === 1;

        if (section.slug === "diferenciais" && differentials.length) {
          return (
            <Section key={section.id} tone="purple">
              <SectionHeading
                eyebrow={section.eyebrow ?? undefined}
                title={section.title}
                description={section.subtitle}
                invert
              />
              <div className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-brand-cream/15 sm:grid-cols-2 lg:grid-cols-3">
                {differentials.map((item, i) => (
                  <Reveal key={item.id} delay={i * 0.05}>
                    <div className="h-full bg-brand-purple p-8">
                      <p className="font-display text-lg text-brand-yellow">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-4 text-xl text-brand-cream">{item.title}</h3>
                      <p className="mt-3 type-body-sm text-brand-cream/75">
                        {item.description}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
              {section.cta_href ? (
                <div className="mt-12">
                  <SectionLink href={section.cta_href} label={section.cta_label} invert />
                </div>
              ) : null}
            </Section>
          );
        }

        if (section.slug === "historia" && timeline.length) {
          return (
            <Section key={section.id} tone="purple">
              <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:items-start">
                <div>
                  <SectionHeading
                    eyebrow={section.eyebrow ?? undefined}
                    title={section.title}
                    description={section.body}
                    invert
                  />
                  {section.cta_href ? (
                    <div className="mt-10">
                      <SectionLink href={section.cta_href} label={section.cta_label} invert />
                    </div>
                  ) : null}
                </div>
                <ol className="relative border-l border-brand-cream/20 pl-8">
                  {timeline.slice(0, 5).map((event, i) => (
                    <Reveal key={event.id} delay={i * 0.06}>
                      <li className="relative pb-10 last:pb-0">
                        <span className="absolute -left-[38px] top-1.5 size-3 rounded-full bg-brand-yellow" />
                        <p className="type-h3 text-brand-yellow">{event.year}</p>
                        <h3 className="mt-1 text-lg text-brand-cream">{event.title}</h3>
                        <p className="mt-2 type-body-sm text-brand-cream/70">
                          {event.description}
                        </p>
                      </li>
                    </Reveal>
                  ))}
                </ol>
              </div>
            </Section>
          );
        }

        return (
          <Section key={section.id} tone={purple ? "purple" : section.variant === "cream" ? "cream" : "white"}>
            <div
              className={cn(
                "grid items-center gap-14",
                image ? "lg:grid-cols-2 lg:gap-20" : "lg:grid-cols-[1fr_auto]",
              )}
            >
              <div className={cn(image && flipped && "lg:order-2")}>
                <SectionHeading
                  eyebrow={section.eyebrow ?? undefined}
                  title={section.title}
                  description={section.body ?? section.subtitle}
                  invert={purple}
                />
                {section.cta_href ? (
                  <div className="mt-10">
                    <SectionLink href={section.cta_href} label={section.cta_label} invert={purple} />
                  </div>
                ) : null}
              </div>

              {image ? (
                <Reveal delay={0.1} className={cn(flipped && "lg:order-1")}>
                  <div className="overflow-hidden rounded-3xl">
                    <img
                      src={image}
                      alt={section.title}
                      width={1600}
                      height={1088}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                </Reveal>
              ) : null}
            </div>
          </Section>
        );
      })}

      {/* Parceiros */}
      {partners.length ? (
        <Section tone="cream">
          <SectionHeading
            eyebrow="Parceiros"
            title="Operações que dependem de constância"
            description="Buffets, casas de festas e empresas que integraram a Salgadjén à própria operação."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {partners.slice(0, 6).map((partner, i) => (
              <Reveal key={partner.id} delay={i * 0.06}>
                <Link
                  to="/parceiros/$slug"
                  params={{ slug: partner.slug }}
                  className="group flex h-full flex-col justify-between rounded-3xl bg-card p-8 transition-shadow hover:shadow-raised"
                >
                  <div>
                    <p className="eyebrow text-brand-yellow">{partner.segment}</p>
                    <h3 className="mt-4 text-xl text-brand-purple-deep">{partner.name}</h3>
                    <p className="mt-3 type-body-sm text-muted-foreground">
                      {partner.summary}
                    </p>
                  </div>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-purple">
                    Ver o case
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Depoimentos */}
      {testimonials.length ? (
        <Section tone="white">
          <SectionHeading
            eyebrow="Depoimentos"
            title="A confiança de quem organiza"
            align="center"
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.slice(0, 3).map((item, i) => (
              <Reveal key={item.id} delay={i * 0.08}>
                <figure className="flex h-full flex-col rounded-3xl border border-border bg-background p-8">
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
        </Section>
      ) : null}

      {/* CTA final */}
      <Section tone="yellow">
        <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <p className="eyebrow text-brand-purple-deep/70">Próximo passo</p>
            <h2 className="type-display mt-5 max-w-2xl text-brand-purple-deep">
              Conte o que você está organizando. Cuidamos do resto.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-wrap gap-4 lg:justify-end">
            <Link
              to="/orcamento"
              className={buttonVariants({ variant: "primary", size: "xl" })}
            >
              Montar meu orçamento
              <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/contato"
              className={buttonVariants({ variant: "outline", size: "xl" })}
            >
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
