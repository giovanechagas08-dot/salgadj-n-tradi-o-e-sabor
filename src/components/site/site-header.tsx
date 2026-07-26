import { buttonVariants } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { BRAND, LOGO_LIGHT, LOGO_DARK, NAV, whatsappLink } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-brand-cream/95 py-2 shadow-card backdrop-blur"
          : "bg-transparent py-4",
      )}
    >
      <div className="container-page flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center" aria-label={`${BRAND.name} — página inicial`}>
          <img
            src={scrolled ? LOGO_DARK : LOGO_LIGHT}
            alt={`Logotipo ${BRAND.name}`}
            width={180}
            height={54}
            className="h-9 w-auto md:h-11"
          />
        </Link>

        <nav className="hidden items-center gap-6 xl:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "text-sm font-medium transition-colors",
                scrolled
                  ? "text-brand-purple-deep/80 hover:text-brand-purple"
                  : "text-brand-cream/85 hover:text-brand-yellow",
              )}
              activeProps={{
                className: scrolled ? "text-brand-purple" : "text-brand-yellow",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={whatsappLink(`Olá! Gostaria de falar com a ${BRAND.name}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "hidden items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors lg:inline-flex",
              scrolled
                ? "border-brand-purple/25 text-brand-purple hover:bg-brand-purple hover:text-brand-cream"
                : "border-brand-cream/40 text-brand-cream hover:bg-brand-cream hover:text-brand-purple",
            )}
          >
            <MessageCircle className="size-4" />
            WhatsApp
          </a>
          <Link
            to="/orcamento"
            className={buttonVariants({ variant: "secondary", size: "sm", className: "hidden sm:inline-flex" })}
          >
            Solicitar orçamento
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menu"
            className={cn(
              "inline-flex size-10 items-center justify-center rounded-full border xl:hidden",
              scrolled
                ? "border-brand-purple/20 text-brand-purple"
                : "border-brand-cream/40 text-brand-cream",
            )}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="container-page xl:hidden">
          <div className="mt-3 rounded-2xl bg-card p-4 shadow-xl">
            <div className="flex flex-col">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="border-b border-border/60 py-3 text-sm font-medium text-brand-purple-deep last:border-0"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/orcamento"
                onClick={() => setOpen(false)}
                className={buttonVariants({ variant: "primary", size: "md", className: "mt-4" })}
              >
                Solicitar orçamento
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
