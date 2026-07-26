import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { WhatsAppFab } from "@/components/site/whatsapp-fab";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="type-hero-xl text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Salgadjén — Há 38 anos fazendo parte dos melhores momentos" },
      {
        name: "description",
        content:
          "Empresa familiar fundada em 1988. Soluções gastronômicas para buffets, casas de festas, empresas e grandes eventos, com produção sob demanda e entrega pontual.",
      },
      { name: "author", content: "Salgadjén" },
      { property: "og:site_name", content: "Salgadjén" },
      { property: "og:title", content: "Salgadjén — Há 38 anos fazendo parte dos melhores momentos" },
      {
        property: "og:description",
        content:
          "Empresa familiar fundada em 1988. Soluções gastronômicas para buffets, casas de festas, empresas e grandes eventos, com produção sob demanda e entrega pontual.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Salgadjén — Há 38 anos fazendo parte dos melhores momentos" },
      { name: "twitter:description", content: "Empresa familiar fundada em 1988. Soluções gastronômicas para buffets, casas de festas, empresas e grandes eventos, com produção sob demanda e entrega pontual." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/16969872-dd8b-41aa-a832-c836f28a4d4d/id-preview-02d653bb--9a0bc9ab-b8a7-46b6-8dc1-5621460d4802.lovable.app-1785090314897.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/16969872-dd8b-41aa-a832-c836f28a4d4d/id-preview-02d653bb--9a0bc9ab-b8a7-46b6-8dc1-5621460d4802.lovable.app-1785090314897.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preload", as: "font", type: "font/woff2", crossOrigin: "anonymous", href: "/__l5e/assets-v1/8053679b-e63d-454c-9dbb-fc84664ece3e/DKDisplayPatrol-Regular.woff2" },
      { rel: "preload", as: "font", type: "font/woff2", crossOrigin: "anonymous", href: "/__l5e/assets-v1/9a0c3568-7579-45bb-ae29-f1074c463196/Bulo-Regular.woff2" },
      { rel: "preload", as: "font", type: "font/woff2", crossOrigin: "anonymous", href: "/__l5e/assets-v1/0afe2bcc-8916-4ce6-b249-4857b8e51a3e/Colby-Regular.woff2" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Salgadjén",
          description:
            "Soluções gastronômicas para buffets, casas de festas, empresas e grandes eventos desde 1988.",
          foundingDate: "1988",
          priceRange: "$$",
          areaServed: "São Paulo, Brasil",
          address: { "@type": "PostalAddress", addressLocality: "São Paulo", addressRegion: "SP", addressCountry: "BR" },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SiteHeader />
      <main className="min-h-screen">
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </main>
      <SiteFooter />
      <WhatsAppFab />
    </QueryClientProvider>
  );
}
