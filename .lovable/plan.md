## Situação atual (verificada)

- Existem hoje `src/routes/estrutura.tsx` e `src/routes/processos.tsx`. **Não existe** `src/routes/grandes-eventos.tsx` (a rota nunca foi criada) — nada a apagar ali.
- A home não tem seções escritas à mão: ela renderiza dinamicamente as 10 seções vindas do banco (`home_sections`), na ordem: experiência, história, quem-somos, estrutura, processos, diferenciais, parceiros, grandes-eventos, produtos, tabela. Somando hero, números, grid de parceiros, depoimentos e CTA final, chega-se às 14 seções.
- Os bugs relatados têm origem nessa lista: "parceiros" aparece como seção do banco **e** como grid de parceiros; "produtos" e "tabela" são duas seções seguidas de mesmo tom claro (daí a sensação de parágrafos sobrepostos); e o grid de diferenciais renderiza **todos** os registros do banco, sem limite de 6.
- Links para as rotas removidas: `src/lib/brand.ts` (menu), `src/routes/quem-somos.tsx` (CTA "Ver nossa estrutura" → /estrutura), `src/routes/estrutura.tsx` (→ /processos), `src/routes/processos.tsx` (→ /diferenciais), e os CTAs das seções do banco na home.

Observação (fora do escopo, só para você saber): rotas como `/produtos`, `/orcamento`, `/contato`, `/conteudos` e `/tabela-de-valores` ainda não existem no projeto — links para elas continuarão dando 404 até serem construídas. Não vou mexer nisso agora.

## O que será feito

**1. Remover as páginas**
- Apagar `src/routes/estrutura.tsx` e `src/routes/processos.tsx`; a árvore de rotas é regenerada automaticamente pelo plugin do router.
- Server functions e loaders (`getEstrutura`, `getProcessos`) permanecem intactos, sem uso.

**2. Zerar links quebrados**
- `src/lib/brand.ts`: menu "A Salgadjén" passa a ter apenas Quem somos, História e Parceiros (com as descrições indicadas). O footer usa a mesma constante, então se atualiza sozinho.
- `src/routes/quem-somos.tsx`: o bloco final que aponta para `/estrutura` passa a apontar para `/parceiros` ("Ver os cases"), mantendo o encadeamento narrativo.
- Home: as seções de estrutura, processos e grandes-eventos deixam de ser renderizadas (ver abaixo), eliminando os CTAs correspondentes.
- Varredura final para confirmar zero ocorrências de `/estrutura`, `/processos` e `/grandes-eventos`.

**3. Enxugar a home (`src/routes/index.tsx`)**

Passa a renderizar exatamente 8 seções, filtrando as seções do banco por uma lista permitida no próprio componente (sem alterar banco nem server functions):

1. Hero — inalterado
2. Números — 4 stats
3. Experiência — seção `experiencia` + link para /experiencia
4. História — seção `historia` com timeline limitada a **4** marcos + link para /historia
5. Diferenciais — seção `diferenciais` com no máximo **6** itens, numerados sequencialmente 01–06 pela posição
6. Parceiros / prova social — **apenas** o bloco de 3 depoimentos, com link "Ver cases →" para /parceiros (o grid de cards de parceiros e a seção `parceiros` do banco saem)
7. Produtos — um único bloco, com um só parágrafo, e dois CTAs: "Ver produtos →" e "Tabela de valores →" (funde as seções `produtos` e `tabela`, o que resolve a sobreposição)
8. CTA final amarelo — inalterado

Saem da home: quem-somos, estrutura, processos, grandes-eventos, grid de parceiros e a seção duplicada de tabela.

O `head()` de SEO da home fica exatamente como está.

## Detalhes técnicos

- A filtragem usa um mapa de slugs permitidos (`experiencia`, `historia`, `diferenciais`) mais um render dedicado para o bloco de produtos que lê as seções `produtos`/`tabela` do banco apenas para título e labels de CTA; nada é hardcoded que já venha do CMS.
- `differentials.slice(0, 6)` com índice de posição para a numeração; `timeline.slice(0, 4)`.
- Imports não usados (`eventosImg`, `producaoImg`, `partners`) são removidos, e o mapa `SECTION_IMAGES` fica só com `historia`.
- Continuam sendo usados os componentes canônicos `Section`, `SectionHeading`, `Reveal`, `buttonVariants`. Nenhuma mudança em `src/styles.css`, tokens, componentes base ou migrações.
