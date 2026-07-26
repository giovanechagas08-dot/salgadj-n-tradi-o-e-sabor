import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

/** Tons de superfície oficiais para seções institucionais. */
const TONES = {
  cream: "bg-background text-foreground",
  white: "bg-surface text-surface-foreground",
  raised: "bg-surface-raised text-surface-foreground",
  purple: "bg-brand-purple text-brand-cream",
  ink: "bg-brand-ink text-brand-cream",
  yellow: "bg-brand-yellow text-brand-purple-deep",
} as const;

/** Três degraus de ritmo vertical. Nenhum padding vertical avulso em páginas. */
const RHYTHM = {
  sm: "section-sm",
  md: "section-md",
  lg: "section-lg",
} as const;

export function Section({
  children,
  className,
  tone = "cream",
  rhythm = "md",
  width = "page",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: keyof typeof TONES;
  rhythm?: keyof typeof RHYTHM;
  width?: "page" | "narrow";
  id?: string;
}) {
  return (
    <section id={id} className={cn(RHYTHM[rhythm], TONES[tone], className)}>
      <div className={width === "narrow" ? "container-narrow" : "container-page"}>{children}</div>
    </section>
  );
}

export function Eyebrow({
  children,
  invert = false,
  className,
}: {
  children: ReactNode;
  invert?: boolean;
  className?: string;
}) {
  return (
    <p className={cn("eyebrow", invert ? "text-brand-yellow" : "text-primary/70", className)}>
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  invert = false,
  level = "h2",
  rule = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string | null;
  align?: "left" | "center";
  invert?: boolean;
  /** Nível semântico do título — a escala visual permanece a mesma. */
  level?: "h2" | "h3";
  /** Filete dourado institucional abaixo do título. */
  rule?: boolean;
}) {
  const Title = level;

  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? <Eyebrow invert={invert}>{eyebrow}</Eyebrow> : null}
      <Title
        className={cn(
          "type-display mt-4",
          invert ? "text-brand-cream" : "text-brand-purple-deep",
          rule && "rule-gold",
          rule && align === "center" && "[&::after]:mx-auto",
        )}
      >
        {title}
      </Title>
      {description ? (
        <p
          className={cn(
            "type-body-lg mt-6",
            invert ? "text-brand-cream/80" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
