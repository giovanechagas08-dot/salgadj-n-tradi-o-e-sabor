
# Salgadjén — Plataforma Institucional Premium (v2, com ajustes aprovados)

Arquitetura técnica, banco, CMS e faseamento mantidos. Abaixo o que muda e o que se soma.

## 1. Identidade visual — preservada, não recriada

Paleta institucional oficial (extraída do seu PDF), aplicada como tokens semânticos em `src/styles.css`:

- **Amarelo institucional `#FFA300`** — cor de destaque principal (CTAs, âncoras visuais, números-marco).
- **Roxo institucional `#662978`** — cor secundária principal (fundos institucionais, tipografia de autoridade, faixas full-bleed).
- **Vinho `#660D3B`** — profundidade, usado em pequenas áreas e sobreposições.
- **Creme `#FFF0E0` / Pêssego `#FFDEBA`** — áreas de respiro, fundo padrão das seções.
- **Coral `#F04F5E` / Verde `#71CC98`** — apoio pontual (tags, categorias, estados), nunca protagonistas.

Nada de dourado, verde oliva ou qualquer direção estética nova. A sofisticação vem de fotografia, composição, grid editorial, escala tipográfica, espaçamento generoso, hierarquia e motion — não de troca de cores.

**Tipografia**: DK Display Patrol, Colby e Bulo são fontes licenciadas e não estão disponíveis publicamente. Duas opções: (a) você envia os arquivos `.woff2/.otf` e eu carrego como `@font-face` — caminho ideal; (b) começo com substitutas próximas em espírito ao logo (títulos em fonte arredondada de display, subtítulos e corpo em sans geométrica humanista) e troco depois sem retrabalho, porque tudo passa por tokens `--font-display`, `--font-subtitle`, `--font-body`.

Logotipo: as 6 variações enviadas (roxo, amarelo, bege, branco, preto, avatares) entram como assets, cada uma usada no fundo correto.

## 2. Home como storytelling, na ordem exigida

A home é uma jornada em capítulos full-bleed, alternando roxo institucional e creme, com reveal por scroll:

1. **Experiência** — hero: "Há 38 anos fazendo parte dos melhores momentos." Fotografia ampla, sem grade de produtos à vista.
2. **História** — teaser da linha do tempo 1988 → hoje, com "1988" como elemento gráfico.
3. **Quem somos** — empresa familiar, gente, propósito.
4. **Estrutura** — números de capacidade produtiva, imagens de produção.
5. **Processos** — etapas do produzir sob demanda.
6. **Diferenciais** — blocos curtos, sem clichê.
7. **Parceiros** — cases em destaque (não parede de logos).
8. **Grandes Eventos**.
9. **Produtos** — só aqui, como consequência.
10. **Tabela de Valores** — chamada.
11. **Solicitar orçamento** — CTA final.

Menu principal segue a mesma ordem narrativa. Cada capítulo tem página própria e profunda.

## 3. Rotas (ajustadas)

```text
/                    Jornada institucional
/experiencia  /historia  /quem-somos  /estrutura  /processos
/diferenciais  /parceiros  /parceiros/$slug (case)
/grandes-eventos
/produtos  /produtos/$slug
/tabela-de-valores
/galeria
/conteudos  /conteudos/$slug        ← nunca "blog" na URL nem na navegação
/contato  /orcamento
/auth  /_authenticated/admin/*
/sitemap.xml  /robots.txt
```

## 4. Página de produto (rica, orientada a SEO)

Cada produto: hero com foto grande, história do produto, ingredientes principais, diferenciais, como é produzido, sugestão de ocasião, quantidade recomendada por pessoa, produtos relacionados, FAQ próprio, CTA "adicionar ao orçamento" e SEO individual (title, description, OG, canonical, Product + FAQPage + BreadcrumbList JSON-LD). Campos correspondentes acrescentados à tabela `products` e a uma tabela `product_faqs`.

## 5. Página Estrutura

Seções dedicadas: produção, equipe, equipamentos, controle de qualidade, processo produtivo, armazenamento, congelamento, logística, expedição, entregas e capacidade produtiva — cada uma com imagem e números. Modelada como `structure_sections` no CMS (ícone, título, texto, imagem, ordem) para expansão livre.

## 6. Parceiros como cases

Tabela `partners` ampliada + `partner_cases`: logo, história da parceria, galeria de fotos, vídeos, desafio, solução entregue, resultado (com métricas) e depoimento vinculado. Campo `featured` e `display_order` para dar posição de destaque ao Camarote Aura quando a parceria for concluída.

## 7. Galeria

`gallery_categories` (Eventos, Produção, Equipe, Bastidores, Clientes, Grandes Eventos, Buffet, Corporativo) + `gallery_items` com tipo imagem ou vídeo, thumb, legenda e ordem. Filtro por categoria, lightbox com navegação por teclado.

## 8. Orçamento

Carrinho de cotação persistido em `localStorage` (salvar e continuar depois), com nome opcional para o orçamento, retomada automática ao voltar, envio para o banco (`quotes` + `quote_items`) e mensagem formatada para WhatsApp. Estrutura já preparada para, no futuro, vincular o orçamento a um usuário logado (`quotes.user_id` nullable desde o início).

## 9. CMS — módulos adicionais

Além dos já aprovados: **Banner Manager**, **Hero Manager**, **CTA Manager**, **Seções da Home** (ordem, visibilidade e conteúdo de cada capítulo), **Estatísticas**, **Linha do Tempo**, **Cases**, **Parceiros**, **Conteúdo Institucional**. Regra firme: nenhum texto, número ou imagem do site fica hardcoded — tudo vem do banco, com valores iniciais criados via migration.

## 10. Dashboard analítico

Tabela `page_views` e `events` (tipo, alvo, origem/referrer, UTM, timestamp) alimentada por um endpoint próprio. Dashboard mostra: produtos mais acessados, páginas mais visitadas, origem dos visitantes, conversões, cliques no WhatsApp, orçamentos enviados e evolução mensal (gráficos com Recharts).

## 11. SEO ampliado

Organization + LocalBusiness (endereço, horários, área atendida), FAQPage, Review/AggregateRating a partir dos depoimentos, BreadcrumbList em todas as rotas profundas, Product nas páginas de produto, Article em Conteúdos. Open Graph por rota, canonical self-referente, sitemap dinâmico, robots.txt, SEO local e campos prontos para Google Business Profile no módulo de Configurações.

## 12. Conteúdos

Seção nomeada **"Conteúdos"** (subtítulo "Guia para Eventos"). Pautas iniciais já cadastradas: cálculo de quantidade de salgados por pessoa, como escolher um fornecedor para eventos, tendências para eventos corporativos, organização de festas, bastidores da produção.

## 13. Experiência premium

Referências de comportamento, não de estética: transições de página suaves, reveal escalonado por seção, parallax leve em imagens grandes, contadores animados nos números institucionais, header que muda de estado no scroll, hover discreto nos cards, respeito a `prefers-reduced-motion`. Nada saltitante, nada genérico.

## Fases de desenvolvimento

1. Fundação: tokens da paleta oficial, tipografia, logos, componentes base, Cloud, schema completo + RLS + seeds.
2. Jornada institucional: home narrativa e as páginas Experiência, História, Quem somos, Estrutura, Processos, Diferenciais.
3. Parceiros/cases, Grandes Eventos, Galeria.
4. Produtos, páginas ricas de produto e Tabela de Valores.
5. Orçamento com salvar/continuar + WhatsApp.
6. CMS completo (incluindo Banner/Hero/CTA/Seções) + papéis + auditoria + Excel.
7. Conteúdos, analytics, SEO técnico e performance.

## Confirmações que preciso de você

- Envio dos arquivos das fontes DK Display Patrol, Colby e Bulo (ou aprovação das substitutas).
- Endereço, telefone, WhatsApp, cidade/região e horários reais (SEO local).
- Fotos reais de produção, equipe e eventos; sem elas, gero imagens de alta qualidade dentro da direção de arte, para substituição posterior pelo CMS.
- Preços visíveis publicamente ou apenas sob orçamento?
