## Confirmações incorporadas

- "Bolinha de catupiry" = sabor **catupiry** do grupo **Bolinho recheado**. Os 49 sabores ficam exatamente nos 15 grupos combinados.
- Verificação de referências dos 7 registros de demonstração (feita agora, somente leitura):
  - `quotes` = 0 linhas, `quote_items` = 0 linhas → **nenhum dos 7 está em orçamento**.
  - Cada um dos 7 tem: 1 preço em `product_prices`, 1 linha em `price_history`, 3 linhas em `product_faqs`.
  - FKs que apontam para `products`: `product_prices`, `price_history`, `product_faqs`, `quote_items`.
  - Conclusão: os 7 podem ser apagados, desde que os dependentes sejam removidos na ordem correta. Nenhum precisará ser apenas despublicado — se algo inesperado bloquear o DELETE na execução, aquele registro recebe `is_published = false` e eu te aviso quais foram.

## Abordagem (aprovada): auto-referência em `products`

Colunas novas em `products`, todas nullable:

- `parent_id uuid` → `products(id)`, `on delete set null`
- `is_group boolean not null default false`
- `flavor_name text`
- `quote_unit text` ('pacote_50' | 'unidade')
- `qty_step integer` (50 fritos / 1 assados)
- `min_qty_per_flavor integer` (200)

Motivos: preserva IDs, slugs e preços dos 49 sabores; preço continua no sabor via `product_prices`; RLS e GRANTs de `products` já cobrem as colunas novas; reversível apagando os 15 pais e limpando as colunas.

Mínimo global de 1.000 unidades vai para `site_settings`, chave `pedido`.

## Ordem de execução

1. **Migração — colunas novas** em `products` (nullable, sem default destrutivo) + índice em `parent_id`.
2. **Limpeza dos 7 antigos** (via insert/DML, com verificação prévia por registro): apagar `product_faqs`, `price_history` e `product_prices` daqueles 7 `product_id`, depois apagar os 7 em `products`. Qualquer registro que ainda assim falhe fica só despublicado e é reportado.
3. **Criar os 15 produtos-pai** (`is_group = true`, `is_published = true`), com categoria (Salgados fritos / Salgados assados), `quote_unit`, `qty_step` e `min_qty_per_flavor = 200`:
   - Fritos (pacote_50, passo 50): Bolinho de aipim, Bolinho recheado, Muçarela, Coxinha, Croquete, Kibe, Risole, Camarão empanado, Salsicha.
   - Assados (unidade, passo 1): Esfirra, Folhado, Italiano, Pastel de forno, Mini lanche, Mini pizza.
4. **Vincular os 49 sabores**: `parent_id` + `flavor_name` por slug (mapeamento fechado, sem adivinhação). Nenhum `UPDATE` em preços.
5. **`site_settings`**: chave `pedido` com `{ "min_total_unidades": 1000 }`.
6. **Loaders retrocompatíveis** (`loadCatalog`, `loadProduct`, `loadQuoteCatalog`): passam a expor `parent_id`, `is_group`, `flavor_name` e as regras de quantidade; `loadProduct` carrega os sabores quando o slug for um grupo. Nenhum campo atual é removido.
7. **Regenerar tipos do Supabase + build.**

## O que NÃO muda

Design system, tokens, componentes e telas; preços, IDs, slugs, imagens e textos dos 49 sabores; home, institucionais, galeria, parceiros e rodapé; políticas de segurança já endurecidas. Nenhuma tela de admin ou /orcamento nesta etapa.

## Relatório final que entregarei

Quantidade de produtos-pai criados, quantidade de sabores vinculados e confirmação da remoção dos 7 antigos (ou a lista dos que ficaram apenas despublicados).
