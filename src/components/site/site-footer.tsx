import { buttonVariants } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import { BRAND, LOGO_LIGHT, NAV, whatsappLink } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="bg-brand-ink text-brand-cream">
      <div className="container-page py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <img
              src={LOGO_LIGHT}
              alt={`Logotipo ${BRAND.name}`}
              width={200}
              height={60}
              loading="lazy"
              className="h-12 w-auto"
            />
            <p className="mt-6 max-w-sm type-body-sm text-brand-cream/70">
              Desde {BRAND.founded}, uma empresa familiar dedicada a soluções gastronômicas para
              buffets, casas de festas, empresas e grandes eventos.
            </p>
            <a
              href={whatsappLink(`Olá! Gostaria de solicitar um orçamento com a ${BRAND.name}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "secondary", size: "lg", className: "mt-8" })}
            >
              Falar com um consultor
            </a>
          </div>

          <div>
            <p className="eyebrow text-brand-yellow">Navegação</p>
            <ul className="mt-6 space-y-3 text-sm">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-brand-cream/75 transition-colors hover:text-brand-yellow">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/tabela-de-valores"
                  className="text-brand-cream/75 transition-colors hover:text-brand-yellow"
                >
                  Tabela de valores
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow text-brand-yellow">Contato</p>
            <ul className="mt-6 space-y-4 text-sm text-brand-cream/75">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 text-brand-yellow" />
                {BRAND.phone}
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 text-brand-yellow" />
                {BRAND.email}
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 text-brand-yellow" />
                {BRAND.city}
              </li>
              <li className="flex items-start gap-3">
                <Instagram className="mt-0.5 size-4 text-brand-yellow" />
                @salgadjen
              </li>
            </ul>
            <Link
              to="/contato"
              className={buttonVariants({ variant: "inverse", size: "md", className: "mt-8" })}
            >
              Página de contato
            </Link>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-brand-cream/15 pt-8 text-xs text-brand-cream/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {BRAND.name}. Todos os direitos reservados.
          </p>
          <p>{BRAND.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
