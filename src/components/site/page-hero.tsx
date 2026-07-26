import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { MOTION } from "./reveal";

/**
 * Cabeçalho de página institucional.
 * Direção de arte: fotografia real, luz natural quente, profundidade rasa,
 * sempre coberta pelo scrim roxo para garantir contraste AA do texto.
 */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  children,
  align = "left",
}: {
  eyebrow?: string | null;
  title: string;
  subtitle?: string | null;
  image?: string | null;
  children?: ReactNode;
  align?: "left" | "center";
}) {
  const reduced = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden bg-brand-purple-deep pb-20 pt-36 text-brand-cream md:pb-24 md:pt-44">
      {image ? (
        <>
          <img
            src={image}
            alt=""
            aria-hidden="true"
            loading="eager"
            className="absolute inset-0 -z-10 size-full object-cover opacity-35"
          />
          <div aria-hidden="true" className="overlay-scrim-hero absolute inset-0 -z-10" />
        </>
      ) : null}

      <div className="container-page">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: MOTION.duration.slow, ease: MOTION.ease.entrance }}
          className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}
        >
          {eyebrow ? <p className="eyebrow text-brand-yellow">{eyebrow}</p> : null}
          <h1 className="type-hero mt-5">{title}</h1>
          {subtitle ? <p className="type-lead mt-6 text-brand-cream/80">{subtitle}</p> : null}
          {children ? <div className="mt-10">{children}</div> : null}
        </motion.div>
      </div>
    </section>
  );
}
