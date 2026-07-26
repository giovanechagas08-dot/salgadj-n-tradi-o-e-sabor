import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

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
  return (
    <section className="relative isolate overflow-hidden bg-brand-purple-deep pb-20 pt-36 text-brand-cream md:pb-28 md:pt-44">
      {image ? (
        <>
          <img
            src={image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-10 size-full object-cover opacity-35"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-purple-deep/85 via-brand-purple-deep/70 to-brand-purple-deep"
          />
        </>
      ) : null}

      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}
        >
          {eyebrow ? <p className="eyebrow text-brand-yellow">{eyebrow}</p> : null}
          <h1 className="mt-5 text-4xl leading-[1.05] md:text-5xl lg:text-6xl">{title}</h1>
          {subtitle ? (
            <p className="mt-6 text-lg leading-relaxed text-brand-cream/80">{subtitle}</p>
          ) : null}
          {children ? <div className="mt-10">{children}</div> : null}
        </motion.div>
      </div>
    </section>
  );
}
