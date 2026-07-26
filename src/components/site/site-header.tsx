import { buttonVariants } from "@/components/ui/button";
import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { BRAND, LOGO_LIGHT, LOGO_DARK, NAV_PRIMARY, whatsappLink } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [mobileGroup, setMobileGroup] = useState<string | null>("A Salgadjén");
  const groupRef = useRef<HTMLDivElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMenuOpen(null);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(null);
        setOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (groupRef.current && !groupRef.current.contains(e.target as Node)) setMenuOpen(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, []);

  const linkTone = scrolled
    ? "text-brand-purple-deep/80 hover:text-brand-purple"
    : "text-brand-cream/85 hover:text-brand-yellow";
  const activeTone = scrolled ? "text-brand-purple" : "text-brand-yellow";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "bg-brand-cream/95 py-2 shadow-card backdrop-blur" : "bg-transparent py-4",
      )}
    >
      <div className="container-page flex items-center justify-between gap-8">
        <Link to="/" className="shrink-0" aria-label={`${BRAND.name} — página inicial`}>
          <img
            src={scrolled ? LOGO_DARK : LOGO_LIGHT}
            alt={`Logotipo ${BRAND.name}`}
            width={180}
            height={54}
            className="h-9 w-auto md:h-11"
          />
        </Link>

        <nav className="hidden min-w-0 items-center gap-8 lg:flex" aria-label="Navegação principal">
          {NAV_PRIMARY.map((item) => {
            if (!item.children) {
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn("text-sm font-medium transition-colors", linkTone)}
                  activeProps={{ className: activeTone }}
                >
                  {item.label}
                </Link>
              );
            }
            const isActive = item.children.some((c) => pathname.startsWith(c.to));
            const expanded = menuOpen === item.label;
            return (
              <div
                key={item.label}
                ref={groupRef}
                className="relative"
                onMouseEnter={() => setMenuOpen(item.label)}
                onMouseLeave={() => setMenuOpen(null)}
              >
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={expanded}
                  onClick={() => setMenuOpen(expanded ? null : item.label)}
                  onFocus={() => setMenuOpen(item.label)}
                  className={cn(
                    "inline-flex items-center gap-1.5 text-sm font-medium transition-colors",
                    linkTone,
                    isActive && activeTone,
                  )}
                >
                  {item.label}
                  <ChevronDown
                    className={cn("size-4 transition-transform duration-200", expanded && "rotate-180")}
                  />
                </button>

                {expanded ? (
                  <div className="absolute left-1/2 top-full z-50 w-[22rem] -translate-x-1/2 pt-4 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-top-1">
                    <div className="rounded-xl border border-border/60 bg-card p-2 shadow-raised">
                      {item.children.map((child) => (
                        <Link
                          key={child.to}
                          to={child.to}
                          className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-muted"
                          activeProps={{ className: "bg-muted" }}
                        >
                          <span className="block text-sm font-semibold text-brand-purple-deep">
                            {child.label}
                          </span>
                          {child.description ? (
                            <span className="block text-xs text-muted-foreground">{child.description}</span>
                          ) : null}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            to="/orcamento"
            className={buttonVariants({ variant: "secondary", size: "sm", className: "hidden sm:inline-flex" })}
          >
            Solicitar orçamento
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            className={cn(
              "inline-flex size-10 items-center justify-center rounded-full border lg:hidden",
              scrolled ? "border-brand-purple/20 text-brand-purple" : "border-brand-cream/40 text-brand-cream",
            )}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="container-page lg:hidden">
          <div className="mt-3 rounded-2xl bg-card p-4 shadow-raised">
            <div className="flex flex-col">
              {NAV_PRIMARY.map((item) => {
                if (!item.children) {
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className="border-b border-border/60 py-3 text-sm font-medium text-brand-purple-deep"
                    >
                      {item.label}
                    </Link>
                  );
                }
                const expanded = mobileGroup === item.label;
                return (
                  <div key={item.label} className="border-b border-border/60">
                    <button
                      type="button"
                      aria-expanded={expanded}
                      onClick={() => setMobileGroup(expanded ? null : item.label)}
                      className="flex w-full items-center justify-between py-3 text-sm font-medium text-brand-purple-deep"
                    >
                      {item.label}
                      <ChevronDown className={cn("size-4 transition-transform", expanded && "rotate-180")} />
                    </button>
                    {expanded ? (
                      <div className="flex flex-col pb-2 pl-3">
                        {item.children.map((child) => (
                          <Link
                            key={child.to}
                            to={child.to}
                            onClick={() => setOpen(false)}
                            className="py-2 text-sm text-muted-foreground"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}

              <a
                href={whatsappLink(`Olá! Gostaria de falar com a ${BRAND.name}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "outline", size: "md", className: "mt-4" })}
              >
                WhatsApp
              </a>
              <Link
                to="/orcamento"
                onClick={() => setOpen(false)}
                className={buttonVariants({ variant: "primary", size: "md", className: "mt-2" })}
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
