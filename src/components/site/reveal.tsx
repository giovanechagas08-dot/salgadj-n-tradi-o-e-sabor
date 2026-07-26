import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, type ReactNode } from "react";

/** Curvas e durações oficiais (espelham os tokens de src/styles.css). */
export const MOTION = {
  duration: { instant: 0.12, fast: 0.2, base: 0.32, slow: 0.56 },
  ease: {
    standard: [0.4, 0, 0.2, 1],
    entrance: [0.22, 1, 0.36, 1],
    exit: [0.4, 0, 1, 1],
  },
} as const;

/**
 * Revelação discreta no scroll. Uma única entrada institucional:
 * fade + deslocamento curto, sempre uma vez, sempre respeitando
 * prefers-reduced-motion.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduced = useReducedMotion();
  const Tag = motion[as] as typeof motion.div;

  if (reduced) {
    const Plain = as;
    return (
      <Plain ref={ref as never} className={className}>
        {children}
      </Plain>
    );
  }

  return (
    <Tag
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{
        duration: MOTION.duration.slow,
        delay,
        ease: MOTION.ease.entrance,
      }}
      className={className}
    >
      {children}
    </Tag>
  );
}

/** Escalonamento padrão para listas e grids (máx. 6 itens visíveis por vez). */
export function stagger(index: number, step = 0.07, max = 6) {
  return Math.min(index, max) * step;
}
