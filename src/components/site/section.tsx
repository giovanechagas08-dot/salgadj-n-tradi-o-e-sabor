import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

export function Section({
  children,
  className,
  tone = "cream",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: "cream" | "white" | "purple" | "ink" | "yellow";
  id?: string;
}) {
  const tones = {
    cream: "bg-background text-foreground",
    white: "bg-card text-card-foreground",
    purple: "bg-brand-purple text-brand-cream",
    ink: "bg-brand-ink text-brand-cream",
    yellow: "bg-brand-yellow text-brand-purple-deep",
  } as const;

  return (
    <section id={id} className={cn("py-20 md:py-28 lg:py-32", tones[tone], className)}>
      <div className="container-page">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  invert = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string | null;
  align?: "left" | "center";
  invert?: boolean;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
      )}
    >
      {eyebrow ? (
        <p className={cn("eyebrow", invert ? "text-brand-yellow" : "text-brand-purple/70")}>
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "mt-4 text-3xl leading-[1.1] md:text-4xl lg:text-5xl",
          invert ? "text-brand-cream" : "text-brand-purple-deep",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-6 text-base leading-relaxed md:text-lg",
            invert ? "text-brand-cream/80" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
