# Design System Salgadjén

Documentação oficial da identidade digital. Fonte de verdade dos tokens: `src/styles.css`.
Página viva (noindex): `/design-system`.

Regra geral: **nenhum valor visual é escrito à mão em componentes**. Cor, tipografia,
espaçamento, raio, sombra e movimento vêm sempre de um token ou utility desta documentação.

---

## 1. Princípios

1. **Autoridade tranquila** — o site fala como uma casa de 38 anos: sem exageros, sem promoções gritadas.
2. **Respiro é conteúdo** — espaço em branco comunica organização e estrutura.
3. **Movimento discreto** — a animação acompanha a leitura, nunca disputa com ela.
4. **Função antes de matiz** — tokens são nomeados pelo papel (`--primary`), não pela cor.
5. **Acessível por padrão** — contraste AA, foco visível, alvos de 44px, motion opcional.

## 2. Cor

### Primitivos de marca (uso restrito a superfícies institucionais)

| Token | Valor | Uso |
| --- | --- | --- |
| `--brand-yellow` | `#FFA300` | Destaque, conversão, filete institucional |
| `--brand-purple` | `#662978` | Ação primária, títulos |
| `--brand-purple-deep` | roxo escurecido | Seções escuras, títulos sobre claro |
| `--brand-cream` | `#FFF0E0` | Texto sobre roxo, fundo quente |
| `--brand-wine` | `#660D3B` | Estado de erro |
| `--brand-ink` | tinta arroxeada | Overlays fotográficos |

### Tokens semânticos

`--background` `--foreground` · `--surface` `--surface-raised` `--surface-inverse`
`--primary` `--primary-hover` `--primary-foreground` `--primary-soft`
`--secondary` `--secondary-hover` `--secondary-foreground` `--secondary-soft`
`--muted` `--muted-foreground` `--accent` `--border` `--border-strong` `--input` `--ring`
`--success` `--warning` `--error` `--info` (+ `-foreground` e `-soft` para cada)

Classes Tailwind correspondentes: `bg-primary`, `text-muted-foreground`, `border-border-strong`,
`bg-success-soft` etc. **Proibido**: `text-white`, `bg-black`, `bg-[#...]`.

Tema único (claro). Não há dark mode neste sistema.

## 3. Tipografia

| Família | Papel |
| --- | --- |
| DK Display Patrol (`--font-display`) | Títulos |
| Bulo (`--font-sans`) | Texto corrido e interface |
| Colby (`--font-eyebrow`) | Subtítulos, rótulos, overlines |

Escala fluida (`clamp`), aplicada **somente** via utilities:

| Utility | Uso |
| --- | --- |
| `type-hero-xl` | Título da home |
| `type-hero` | Título de página |
| `type-display` | Título de seção |
| `type-h1` … `type-h6` | Hierarquia de conteúdo |
| `type-lead` | Parágrafo de abertura |
| `type-body-lg` / `type-body` / `type-body-sm` | Texto |
| `type-caption` | Legendas, metadados |
| `type-label` | Rótulos de formulário |
| `type-button` | Texto de botão |
| `type-overline` / `eyebrow` | Rótulos institucionais |

Medida de leitura máxima: 68 caracteres (`max-w-[68ch]`, aplicado por `Prose`).

## 4. Espaçamento, grid e ritmo

Escala travada em múltiplos de 4/8: `--space-1` (4px) … `--space-32` (128px).

- Container: `container-page` (máx. 1280px, gutter 24px → 40px em ≥1024px) e `container-narrow` (768px).
- Grid: `grid-12` — 4 colunas no mobile, 8 no tablet, 12 no desktop.
- Ritmo de seção: `section-sm`, `section-md`, `section-lg`. Nenhum `py-*` avulso em páginas.

## 5. Elevação e raio

Sombras: `shadow-subtle`, `shadow-card`, `shadow-raised`, `shadow-overlay`.
Raios: `rounded-sm` a `rounded-3xl` derivados de `--radius: 0.75rem`.
Cartões institucionais usam a utility composta `surface-card`.

## 6. Componentes canônicos

| Componente | Arquivo | Observações |
| --- | --- | --- |
| `Button` | `src/components/ui/button.tsx` | Variantes: `primary`, `secondary`, `outline`, `ghost`, `link`, `danger`, `inverse`. Tamanhos: `sm`, `md`, `lg`, `xl`, `icon`. Suporta `loading` e `asChild`. |
| `Section` | `src/components/site/section.tsx` | Props `tone` (cream/white/raised/purple/ink/yellow), `rhythm` (sm/md/lg), `width`. |
| `SectionHeading` / `Eyebrow` | idem | `rule` adiciona o filete dourado. |
| `PageHero` | `src/components/site/page-hero.tsx` | Fotografia + scrim `overlay-scrim-hero`. |
| `Prose` | `src/components/site/prose.tsx` | Texto vindo do CMS, com medida de leitura controlada. |
| `Reveal` / `stagger` | `src/components/site/reveal.tsx` | Revelação no scroll e escalonamento de listas. |

Para links estilizados como botão, use `buttonVariants({ variant, size, className })` —
nunca reescreva as classes do botão à mão.

## 7. Movimento

| Token | Valor |
| --- | --- |
| `--duration-instant` | 120ms |
| `--duration-fast` | 200ms |
| `--duration-base` | 320ms |
| `--duration-slow` | 560ms |
| `--ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `--ease-entrance` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `--ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` |

Padrões permitidos: fade + `y` curto na entrada, escalonamento de até 6 itens (70ms),
sublinhado animado (`link-underline`), elevação sutil no hover de cartões.
Tudo é desativado sob `prefers-reduced-motion`.

## 8. Direção de arte

- Fotografia real de produção, expedição e eventos; nunca banco de imagens genérico.
- Luz natural, temperatura quente, profundidade rasa, composição com respiro.
- Sobre imagem escura: `overlay-scrim`; em heros: `overlay-scrim-hero`.
- Imagens decorativas recebem `alt=""` e `aria-hidden`; imagens de conteúdo recebem alt descritivo.

## 9. Acessibilidade

- Foco único: contorno de 2px em `--ring` com `outline-offset: 3px`.
- Contraste mínimo AA (4.5:1) para texto; texto sobre foto exige scrim.
- Alvos de toque com no mínimo 44×44px (`size-11`).
- Um único `<main>` por página; hierarquia de títulos sem saltos.

## 10. Como construir uma página nova

1. `PageHero` com eyebrow, título e subtítulo.
2. Alterne `Section` com `tone` e `rhythm` para criar respiro narrativo.
3. Títulos via `SectionHeading`; textos via `Prose` ou utilities `type-*`.
4. Ações via `Button` / `buttonVariants`.
5. Envolva blocos em `Reveal` com `stagger(i)` em listas.
6. Declare `head()` com título, descrição e Open Graph próprios da rota.
