import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading, Eyebrow } from "@/components/site/section";
import { Reveal, stagger } from "@/components/site/reveal";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/design-system")({
  head: () => ({
    meta: [
      { title: "Design System — Salgadjén" },
      {
        name: "description",
        content:
          "Documentação viva da identidade digital Salgadjén: tokens, tipografia, ritmo, componentes e movimento.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Design System — Salgadjén" },
      { property: "og:type", content: "website" },
      {
        property: "og:description",
        content: "Tokens, tipografia, componentes e movimento da identidade digital Salgadjén.",
      },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DesignSystemPage,
});

const COLORS: { token: string; label: string; className: string; note: string }[] = [
  { token: "--primary", label: "Primary", className: "bg-primary", note: "Roxo institucional" },
  {
    token: "--primary-hover",
    label: "Primary hover",
    className: "bg-primary-hover",
    note: "Estado hover",
  },
  {
    token: "--secondary",
    label: "Secondary",
    className: "bg-secondary",
    note: "Amarelo institucional",
  },
  {
    token: "--secondary-hover",
    label: "Secondary hover",
    className: "bg-secondary-hover",
    note: "Estado hover",
  },
  { token: "--background", label: "Background", className: "bg-background", note: "Fundo base" },
  { token: "--surface", label: "Surface", className: "bg-surface", note: "Cartões" },
  {
    token: "--surface-raised",
    label: "Surface raised",
    className: "bg-surface-raised",
    note: "Blocos elevados",
  },
  {
    token: "--surface-inverse",
    label: "Surface inverse",
    className: "bg-surface-inverse",
    note: "Seções escuras",
  },
  { token: "--muted", label: "Muted", className: "bg-muted", note: "Apoio neutro" },
  { token: "--border", label: "Border", className: "bg-border", note: "Traço padrão" },
  { token: "--success", label: "Success", className: "bg-success", note: "Confirmação" },
  { token: "--warning", label: "Warning", className: "bg-warning", note: "Atenção" },
  { token: "--error", label: "Error", className: "bg-error", note: "Erro / vinho" },
  { token: "--info", label: "Info", className: "bg-info", note: "Informação" },
];

const TYPE_SCALE = [
  { cls: "type-hero-xl", label: "Hero XL", use: "Título da home" },
  { cls: "type-hero", label: "Hero", use: "Título de página" },
  { cls: "type-display", label: "Display", use: "Título de seção" },
  { cls: "type-h1", label: "H1", use: "Título de conteúdo" },
  { cls: "type-h2", label: "H2", use: "Subseção" },
  { cls: "type-h3", label: "H3", use: "Cartões" },
  { cls: "type-h4", label: "H4", use: "Blocos internos" },
  { cls: "type-lead", label: "Lead", use: "Parágrafo de abertura" },
  { cls: "type-body-lg", label: "Body LG", use: "Texto institucional" },
  { cls: "type-body", label: "Body", use: "Texto padrão" },
  { cls: "type-body-sm", label: "Body SM", use: "Texto auxiliar" },
  { cls: "type-caption", label: "Caption", use: "Legendas" },
  { cls: "type-label", label: "Label", use: "Formulários" },
  { cls: "type-overline", label: "Overline", use: "Rótulos" },
];

const SPACING = [
  ["space-1", "4px"],
  ["space-2", "8px"],
  ["space-3", "12px"],
  ["space-4", "16px"],
  ["space-6", "24px"],
  ["space-8", "32px"],
  ["space-10", "40px"],
  ["space-12", "48px"],
  ["space-16", "64px"],
  ["space-20", "80px"],
  ["space-24", "96px"],
  ["space-32", "128px"],
];

const SHADOWS = ["shadow-subtle", "shadow-card", "shadow-raised", "shadow-overlay"];
const RADII = ["rounded-sm", "rounded-md", "rounded-lg", "rounded-xl", "rounded-2xl", "rounded-3xl"];

function DesignSystemPage() {
  return (
    <div className="pt-28">
      <Section tone="purple" rhythm="md">
        <Eyebrow invert>Documentação oficial</Eyebrow>
        <h1 className="type-hero mt-5 text-brand-cream">Design System Salgadjén</h1>
        <p className="type-lead mt-6 max-w-2xl text-brand-cream/80">
          A identidade digital de uma casa com 38 anos de história. Todo componente, cor,
          espaçamento e movimento do site nasce das regras desta página.
        </p>
      </Section>

      {/* Cores */}
      <Section tone="cream" rhythm="md" id="cores">
        <SectionHeading
          eyebrow="Fundação"
          title="Tokens de cor"
          description="Nomeados por função, nunca por matiz. Componentes usam apenas tokens semânticos; os primitivos de marca ficam reservados a superfícies institucionais."
          rule
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {COLORS.map((c, i) => (
            <Reveal key={c.token} delay={stagger(i)}>
              <div className="surface-card overflow-hidden">
                <div className={`h-24 w-full ${c.className}`} />
                <div className="p-5">
                  <p className="type-h6 text-brand-purple-deep">{c.label}</p>
                  <p className="type-caption mt-1 font-mono text-muted-foreground">{c.token}</p>
                  <p className="type-caption mt-2 text-muted-foreground">{c.note}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Tipografia */}
      <Section tone="white" rhythm="md" id="tipografia">
        <SectionHeading
          eyebrow="Fundação"
          title="Escala tipográfica"
          description="Baloo 2 para títulos, Figtree para texto, Archivo para rótulos. Todos os degraus são fluidos via clamp — nenhum tamanho arbitrário é permitido."
          rule
        />
        <div className="mt-12 space-y-8">
          {TYPE_SCALE.map((t) => (
            <div
              key={t.cls}
              className="grid gap-3 border-b border-border pb-6 md:grid-cols-[minmax(0,1fr)_14rem] md:items-baseline"
            >
              <p className={`${t.cls} min-w-0 text-brand-purple-deep`}>
                Há 38 anos nos melhores momentos
              </p>
              <div className="md:text-right">
                <p className="type-label text-foreground">{t.label}</p>
                <p className="type-caption font-mono text-muted-foreground">.{t.cls}</p>
                <p className="type-caption text-muted-foreground">{t.use}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Espaçamento e grid */}
      <Section tone="cream" rhythm="md" id="espacamento">
        <SectionHeading
          eyebrow="Fundação"
          title="Espaçamento, grid e ritmo"
          description="Escala travada em múltiplos de 4 e 8. Grid de 12 colunas no desktop, 8 no tablet, 4 no mobile. Seções usam três degraus de respiro."
          rule
        />
        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div className="surface-card p-8">
            <p className="type-h4 text-brand-purple-deep">Escala de espaçamento</p>
            <ul className="mt-6 space-y-3">
              {SPACING.map(([name, px]) => (
                <li key={name} className="flex items-center gap-4">
                  <span className="type-caption w-24 shrink-0 font-mono text-muted-foreground">
                    {name}
                  </span>
                  <span
                    className="h-3 rounded-full bg-secondary"
                    style={{ width: `var(--${name})` }}
                  />
                  <span className="type-caption text-muted-foreground">{px}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="surface-card p-8">
            <p className="type-h4 text-brand-purple-deep">Grid de 12 colunas</p>
            <div className="grid-12 mt-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 rounded-md bg-primary-soft last:block md:[&:nth-child(n+9)]:hidden lg:[&:nth-child(n+9)]:block"
                />
              ))}
            </div>
            <p className="type-body-sm mt-6 text-muted-foreground">
              Container máximo de 1280px, gutter de 24px (40px a partir de 1024px). Ritmo vertical:
              <span className="font-mono"> section-sm</span>,
              <span className="font-mono"> section-md</span>,
              <span className="font-mono"> section-lg</span>.
            </p>
          </div>
        </div>
      </Section>

      {/* Elevação */}
      <Section tone="white" rhythm="md" id="elevacao">
        <SectionHeading
          eyebrow="Fundação"
          title="Elevação e raio"
          description="Quatro sombras e seis raios. Sombras são suaves, longas e discretas — elegância, nunca dramaticidade."
          rule
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SHADOWS.map((s) => (
            <div key={s} className={`rounded-3xl bg-surface p-8 ${s}`}>
              <p className="type-h6 text-brand-purple-deep">{s.replace("shadow-", "")}</p>
              <p className="type-caption mt-1 font-mono text-muted-foreground">.{s}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-4">
          {RADII.map((r) => (
            <div key={r} className={`border border-border-strong bg-muted px-6 py-5 ${r}`}>
              <p className="type-caption font-mono text-muted-foreground">.{r}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Botões */}
      <Section tone="cream" rhythm="md" id="botoes">
        <SectionHeading
          eyebrow="Componentes"
          title="Botões"
          description="Roxo conduz a ação institucional, amarelo convida à conversão. Todos os estados — hover, foco, ativo, carregando e desabilitado — são padronizados."
          rule
        />
        <div className="mt-12 space-y-10">
          <div className="surface-card p-8">
            <p className="type-label text-muted-foreground">Variantes</p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Button variant="primary">Solicitar orçamento</Button>
              <Button variant="secondary">Falar no WhatsApp</Button>
              <Button variant="outline">Conhecer estrutura</Button>
              <Button variant="ghost">Ver produtos</Button>
              <Button variant="link">Saiba mais</Button>
              <Button variant="danger">Remover item</Button>
            </div>
          </div>
          <div className="rounded-3xl bg-brand-purple-deep p-8">
            <p className="type-label text-brand-cream/70">Sobre superfície escura</p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Button variant="secondary">Solicitar orçamento</Button>
              <Button variant="inverse">
                Nossa história <ArrowRight />
              </Button>
            </div>
          </div>
          <div className="surface-card p-8">
            <p className="type-label text-muted-foreground">Tamanhos e estados</p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra large</Button>
              <Button loading>Enviando</Button>
              <Button disabled>Indisponível</Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Movimento */}
      <Section tone="purple" rhythm="md" id="movimento">
        <SectionHeading
          eyebrow="Movimento"
          title="Animação discreta"
          description="Entrada suave em fade e deslocamento curto, escalonada em listas. Durações de 120ms a 560ms, curva de entrada 0.22/1/0.36/1. Tudo é desligado sob prefers-reduced-motion."
          invert
          rule
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {["Instant 120ms", "Fast 200ms", "Base 320ms"].map((label, i) => (
            <Reveal key={label} delay={stagger(i)}>
              <div className="rounded-3xl border border-brand-cream/20 p-8">
                <p className="type-h5 text-brand-yellow">{label}</p>
                <p className="type-body-sm mt-3 text-brand-cream/75">
                  Micro-interações, hover de cartões e revelações no scroll usam apenas estas
                  durações.
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Direção de arte + acessibilidade */}
      <Section tone="white" rhythm="md" id="direcao-de-arte">
        <SectionHeading
          eyebrow="Direção de arte"
          title="Fotografia e acessibilidade"
          description="Imagens reais de produção e eventos, luz natural quente, profundidade rasa, composição com respiro. Contraste mínimo AA em todos os textos."
          rule
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="surface-card p-8">
            <p className="type-h4 text-brand-purple-deep">Fotografia</p>
            <ul className="type-body mt-5 list-disc space-y-2 pl-5 text-muted-foreground">
              <li>Luz natural, temperatura quente, sem flash duro.</li>
              <li>Profundidade rasa com foco no produto ou nas mãos que produzem.</li>
              <li>Cenas reais de cozinha, expedição e evento — nunca banco de imagens genérico.</li>
              <li>Sobre fotografia escura, sempre aplicar o scrim institucional.</li>
            </ul>
          </div>
          <div className="surface-card p-8">
            <p className="type-h4 text-brand-purple-deep">Acessibilidade</p>
            <ul className="type-body mt-5 list-disc space-y-2 pl-5 text-muted-foreground">
              <li>Anel de foco único: 2px roxo com deslocamento de 3px.</li>
              <li>Alvos de toque com no mínimo 44×44px.</li>
              <li>Texto sobre imagem sempre com scrim garantindo 4.5:1.</li>
              <li>Movimento inteiramente desativado sob prefers-reduced-motion.</li>
            </ul>
          </div>
        </div>
      </Section>
    </div>
  );
}
