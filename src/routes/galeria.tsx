import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHeading } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { GALLERY, GALLERY_CATEGORIES, type GalleryCategory } from "@/data/gallery";
import heroImg from "@/assets/hero-momentos.jpg";

export const Route = createFileRoute("/galeria")({
  head: () => ({
    meta: [
      { title: "Galeria — momentos, mesas e produtos | Salgadjén" },
      {
        name: "description",
        content:
          "Acervo fotográfico da Salgadjén: celebrações, convívio em família, mesas montadas para eventos e nossos salgados em detalhe.",
      },
      { property: "og:title", content: "Galeria Salgadjén" },
      {
        property: "og:description",
        content: "Celebrações, mesas de eventos e produtos registrados em nosso acervo.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/galeria" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/galeria" }],
  }),
  component: GaleriaPage,
});

type Filter = GalleryCategory | "todos";

function GaleriaPage() {
  const [filter, setFilter] = useState<Filter>("todos");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const items = useMemo(
    () => (filter === "todos" ? GALLERY : GALLERY.filter((i) => i.category === filter)),
    [filter],
  );

  return (
    <>
      <PageHero
        eyebrow="Galeria"
        title="Os momentos que ajudamos a construir"
        subtitle="Cada foto deste acervo nasceu de um encontro real — festas, confraternizações, mesas montadas e produtos feitos sob demanda."
        image={heroImg}
      />

      <Section tone="white">
        <SectionHeading
          eyebrow="Acervo"
          title="Navegue por categoria"
          description="Um recorte do que acontece quando a Salgadjén participa da ocasião."
        />

        <div className="mt-10 flex flex-wrap gap-3">
          {(
            [{ id: "todos", label: "Todos" }, ...GALLERY_CATEGORIES] as {
              id: Filter;
              label: string;
            }[]
          ).map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setFilter(c.id)}
              aria-pressed={filter === c.id}
              className={`rounded-full border px-5 py-2 text-sm transition-colors ${
                filter === c.id
                  ? "border-transparent bg-brand-purple text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
          {items.map((item, i) => (
            <Reveal key={item.src} delay={Math.min(i, 8) * 0.03}>
              <button
                type="button"
                onClick={() => setLightbox(GALLERY.indexOf(item))}
                className="group block w-full overflow-hidden rounded-2xl bg-muted"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </button>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="cream">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <SectionHeading
            eyebrow="Próximo passo"
            title="Vamos montar a sua mesa?"
            description="Selecione os produtos e receba um orçamento com atendimento próximo."
          />
          <Link
            to="/produtos"
            className="inline-flex items-center gap-2 rounded-full bg-brand-purple px-7 py-4 text-sm text-primary-foreground transition-opacity hover:opacity-90"
          >
            Ver produtos <ArrowRight className="size-4" />
          </Link>
        </div>
      </Section>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-foreground/90 p-4"
            onClick={() => setLightbox(null)}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="Fechar"
              className="absolute right-6 top-6 rounded-full bg-background/10 p-3 text-background"
            >
              <X className="size-5" />
            </button>
            <motion.img
              key={lightbox}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={GALLERY[lightbox].src}
              alt={GALLERY[lightbox].alt}
              className="max-h-[88vh] max-w-full rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
