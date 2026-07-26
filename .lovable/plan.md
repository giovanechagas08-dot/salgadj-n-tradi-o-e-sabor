## Objetivo

Transformar o visual atual em um **Design System oficial**, documentado e aplicado. Nenhuma funcionalidade nova. Entregas: (1) documento fonte-de-verdade, (2) página viva `/design-system`, (3) tokens e componentes canônicos, (4) refatoração de todas as páginas existentes.

Decisões confirmadas: documento + página viva, página pública fora do sitemap (`noindex`), refatoração completa agora, **apenas tema claro** (dark mode removido).

---

## Fase 1 — Fundação de tokens (`src/styles.css`)

Reescrita organizada por camadas, mantendo integralmente a paleta institucional (#FFA300 amarelo, #662978 roxo, creme, vinho, tinta).

- **Cor primitiva → semântica**: `primary / primary-hover / primary-foreground / secondary / accent / muted / background / surface / surface-raised / border / border-strong / success / warning / error / info`, cada um com foreground e variante suave. Regra: nenhuma cor sem função declarada.
- **Tipografia**: escala completa como utilities — `text-hero-xl, text-hero, text-display, h1…h6, lead, body-lg, body, body-sm, caption, label, btn, overline` — cada uma com size/line-height/weight/letter-spacing fluidos (`clamp`).
- **Espaçamento**: escala travada 4/8/12/16/24/32/40/48/64/80/96/128 (`--space-*`) + ritmo vertical de seção (`section-sm/md/lg`).
- **Grid**: container 1280px, gutters responsivos, breakpoints documentados (sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536), helper de 12 colunas.
- **Elevação e raio**: exatamente 4 sombras (`shadow-subtle/card/raised/overlay`) e 4 raios. Nenhuma sombra ad-hoc.
- **Motion**: durações (120/200/320/560ms), easings (`--ease-entrance`, `--ease-exit`, `--ease-standard`), com bloco global `prefers-reduced-motion`.
- **Foco**: um único anel de foco institucional aplicado a todo elemento interativo.
- Remoção do bloco `.dark` e das ramificações de tema escuro.

## Fase 2 — Camada de componentes canônicos

Padronizar sem inventar componentes novos:

- **Button**: variantes oficiais `primary, secondary, outline, ghost, link, danger` + tamanhos `sm, md, lg, xl, icon`; estados hover/active/focus/disabled/loading (spinner embutido); altura mínima acessível.
- **Card**: um único estilo base com variantes `product, partner, content, case, stat` — mesma sombra, mesmo raio, mesmo padding.
- **Section / SectionHeading**: passam a consumir apenas tokens de ritmo (`section-md`) e da escala tipográfica.
- **Reveal**: unifica fade/slide/scale/stagger com respeito a reduced-motion.
- Ajuste dos primitivos shadcn já presentes (input, select, checkbox, radio, switch, tabs, dialog, drawer, toast, alert, accordion, breadcrumb, pagination, table, skeleton) para tokens, foco e tipografia do sistema. Adição só do que falta como padrão de uso: `EmptyState`, `LoadingState`, `Lightbox` e `Filters` já existentes normalizados.

## Fase 3 — Página viva `/design-system`

Rota pública com `robots: noindex, nofollow`, fora do sitemap, navegação lateral por seções:

Princípios · Cor (swatches + uso + contraste AA) · Tipografia (escala renderizada) · Espaçamento · Grid · Elevação/Raio · Ícones · Motion · Componentes (todos os estados renderizados lado a lado) · Microinterações · Direção de arte · Copy visual · Acessibilidade · Regras de consistência.

## Fase 4 — Documento oficial

`docs/design-system.md` — fonte única de verdade, cobrindo os 16 tópicos solicitados, incluindo:
- Direção de arte fotográfica: temperatura quente (creme/dourado), luz natural difusa, macro e planos médios, profundidade rasa, textura visível do alimento, sem HDR, sem saturação artificial, grão sutil, composição com respiro — regra de tratamento aplicável ao acervo já importado.
- Padrões de copy visual (headline, subtítulo, CTA, feedback, erro de formulário) em tom institucional e humano.
- Regras anti-inconsistência e checklist obrigatório antes de criar qualquer componente novo.
- Registro em memória do projeto para que toda página futura siga o sistema.

## Fase 5 — Refatoração das páginas existentes

Home, Experiência, História, Quem Somos, Estrutura, Processos, Diferenciais, Parceiros (índice e case), Galeria, Header, Footer, WhatsApp FAB — todas passam a usar exclusivamente tokens, escala tipográfica, escala de espaçamento e componentes canônicos. Nenhum valor arbitrário de cor, sombra ou espaçamento permanece.

## Fase 6 — Verificação

- Typecheck limpo.
- Varredura por classes proibidas (`text-white`, `bg-[#…]`, espaçamentos fora da escala, `bg-gradient-to-*`).
- Auditoria de contraste AA nos pares de cor institucionais.
- Navegação por teclado e foco visível em todos os interativos.
- Screenshots de desktop/tablet/mobile das páginas refatoradas para conferência visual.

---

### Notas técnicas

Tailwind v4 CSS-first: tudo em `src/styles.css` via `@theme` / `@theme inline` / `@utility` / `@custom-variant`; sem `tailwind.config.js`. Fontes continuam carregadas por `<link>` em `__root.tsx`. Motion via `motion/react` já instalado. Nenhuma alteração de banco de dados, RLS ou rotas de dados nesta etapa.
