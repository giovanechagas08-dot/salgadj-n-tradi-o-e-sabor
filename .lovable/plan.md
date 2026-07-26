## Objetivo

Criar a página pública `/orcamento` (atacado/revenda), hoje inexistente — os botões "Solicitar orçamento" / "Montar meu orçamento" passam a funcionar.

## O que já existe (verificado)

- 15 grupos + 49 sabores, com `quote_unit`, `qty_step`, `min_qty_per_flavor` nos grupos.
- Regras de mínimo (1.000 total / 200 por sabor) já carregadas por `loadQuoteCatalog`.
- Tabelas de preço de revenda: "Revenda — congelado para fritar" (26 preços) e "Revenda — congelado para assar" (23 preços). Ambas estão marcadas como **não públicas** — por isso o cliente anônimo não as enxerga hoje.
- Carrinho local (`useQuoteCart`) e envio atômico (`submitQuote` → RPC) prontos.
- `whatsappLink()` em `src/lib/brand.ts`.

## Como exibir os preços sem enfraquecer a segurança

As tabelas de revenda continuam privadas no banco (RLS intacta, nada de `is_public = true`, nada de política nova para anônimo). Em vez disso, o servidor faz a leitura controlada:

- Amplio `loadQuoteCatalog` (server-only) para, dentro do handler, carregar as duas tabelas de revenda com o cliente privilegiado do servidor e retornar **apenas** `{ product_id, price, quote_unit }` dos sabores publicados.
- Nada de chave privilegiada no navegador; o cliente recebe só o número de exibição. Fechar os preços no futuro = remover esse bloco do loader.

## Página `/orcamento`

Cabeçalho com as condições visíveis desde o início (mínimo 1.000 unidades no total, 200 por sabor, passo 50 para fritos).

Catálogo:
- Busca por nome de grupo ou sabor.
- Agrupado por categoria (fritos / assados); cada grupo é um bloco expansível com seus sabores.
- Por sabor: nome, preço de revenda com rótulo ("/ pacote de 50" ou "/ unidade") e controle de quantidade (+/− e input) com passo correto.

Cálculo (regra crítica):
- `pacote_50`: subtotal = (quantidade ÷ 50) × preço do pacote.
- `unidade`: subtotal = quantidade × preço.
- Exibe subtotal por sabor, por grupo e total geral, sempre rotulado como "valor estimado, sujeito a confirmação".

Validação bloqueante:
- Sabor com quantidade > 0 precisa de ≥ 200; aviso inline "mínimo 200".
- Passo forçado: fritos múltiplos de 50; assados inteiros.
- Botão de envio desabilitado enquanto o total < 1.000, com aviso do quanto falta.
- Envia só sabores com quantidade > 0, respeitando o limite de 200 itens.

Resumo: painel lateral fixo no desktop, seção final no mobile — itens agrupados, subtotais, total estimado, contador de unidades e status do mínimo.

Formulário: Nome*, Telefone/WhatsApp*, Empresa/buffet, Cidade, Tipo de operação (buffet, casa de festa, revenda, outro), observações. Validação com Zod.

Dois envios:
- "Enviar solicitação" → `submitQuote`, toast de sucesso, estado de confirmação e `clear()` do carrinho.
- "Enviar pelo WhatsApp" → grava via `submitQuote` primeiro e depois abre `whatsappLink()` com a mensagem legível (dados + sabores/quantidades + total estimado).

## Técnico

- Persistência das escolhas em `useQuoteCart` (localStorage), usando `hydrated` para evitar mismatch de SSR.
- `head()` com título "Orçamento de atacado — Salgadjén", description e canonical `/orcamento`.
- Componentes e tokens existentes (`Section`, `SectionHeading`, `Reveal`, `buttonVariants`, inputs shadcn/ui); mobile-first; respeita `prefers-reduced-motion`.
- Arquivos: novo `src/routes/orcamento.tsx` (+ componentes auxiliares se ficar extenso) e ajuste pontual em `src/lib/site.server.ts` / `site.functions.ts` para os preços de revenda.
- Sem mudanças no design system, em migrações de segurança ou nas demais páginas públicas.

## Observação

As rotas `/produtos` e `/conteudos` também não existem ainda e continuam 404 — fora do escopo desta etapa, posso fazê-las em seguida.
