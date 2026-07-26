import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Botão oficial do Design System Salgadjén.
 * Variantes e tamanhos abaixo são os únicos permitidos no projeto.
 * Documentação: docs/design-system.md · Página viva: /design-system
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full type-button",
    "cursor-pointer select-none",
    "transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
    "active:translate-y-px",
    "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
    "[&_svg]:pointer-events-none [&_svg]:size-[1.125em] [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-card hover:bg-primary-hover",
        secondary: "bg-secondary text-secondary-foreground shadow-card hover:bg-secondary-hover",
        outline:
          "border border-border-strong bg-transparent text-foreground hover:border-primary hover:text-primary",
        ghost: "bg-transparent text-foreground hover:bg-muted hover:text-primary",
        link: "bg-transparent text-primary underline-offset-4 hover:underline px-0",
        danger: "bg-error text-error-foreground shadow-card hover:bg-error/90",
        /** Uso exclusivo sobre superfícies escuras (roxo/tinta). */
        inverse:
          "border border-brand-cream/35 bg-transparent text-brand-cream hover:border-brand-yellow hover:text-brand-yellow",
      },
      size: {
        sm: "h-9 px-4 text-[0.8125rem]",
        md: "h-11 px-6",
        lg: "h-12 px-8",
        xl: "h-14 px-10 text-base",
        icon: "size-11 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    if (asChild) {
      return (
        <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
          {children}
        </Comp>
      );
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        aria-busy={loading || undefined}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
        {children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
