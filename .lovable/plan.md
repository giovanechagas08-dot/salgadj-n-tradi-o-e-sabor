## Situação atual (verificada no banco)

- Quase todas as tabelas de conteúdo têm política anônima `USING (true)` — inclusive rascunhos (`is_active=false`, `is_published=false`).
- `price_tables`: leitura pública total. Existem 5 tabelas, 4 privadas (`buffets`, `corporativo`, `revenda-fritos`, `revenda-assados`) e 1 pública (`varejo`).
- `product_prices`: leitura pública total → preços B2B/revenda vazam para visitantes.
- Escritas de conteúdo hoje são todas de `editor` (inclusive `price_tables`, `site_settings`, `products`).
- Sem buckets de storage criados até agora.
- Papéis existentes: `admin`, `editor`, `viewer`.

---

## 1. Visibilidade de preços

- Nova função `public.can_view_price_table(_user_id uuid, _table_id uuid)` (security definer): verdadeira se a tabela for pública e ativa, ou se o usuário for admin/editor, ou se tiver acesso concedido.
- Nova tabela `price_table_access` (usuário × tabela de preço, concedida pelo admin), com GRANT + RLS: usuário lê só os próprios acessos; admin gerencia.
- `price_tables`: política anônima passa a `is_public AND is_active`; autenticados enxergam adicionalmente as privadas às quais têm acesso.
- `product_prices`: leitura condicionada à visibilidade da tabela de preço correspondente (mesma função). Anônimo nunca recebe preço de tabela privada.
- `price_history`: leitura restrita a admin.

## 2. Princípio do menor privilégio nas demais tabelas

- Trocar todo `USING (true)` de leitura anônima por filtro de publicação:
  - `is_active = true`: banners, categories, ctas, differentials, gallery_categories, heroes, home_sections, process_steps, stats, structure_sections, timeline_events, content_categories.
  - `is_published = true`: pages, products, partners, testimonials, gallery_items, content_posts (também `published_at <= now()`).
  - `site_settings`, `product_faqs`, `partner_media`: leitura pública apenas de chaves/itens ligados a registros publicados (settings: lista branca de chaves públicas).
- Editores continuam com acesso total de leitura ao conteúdo (inclusive rascunhos) via `can_edit()`.
- Escritas sensíveis passam a exigir **admin**: `price_tables`, `price_table_access`, `site_settings`, `user_roles`, `audit_logs`.
- `analytics_events` / `page_views`: mantêm inserção pública (necessária para métricas), mas com `WITH CHECK` restringindo os campos gravados; leitura só admin.
- `contacts` / `quotes` / `quote_items`: inserção pública mantida (formulários), com `WITH CHECK` validando vínculo (item precisa referenciar uma cotação existente) em vez de `true`; leitura permanece restrita a admin/editor e ao próprio autor.

## 3. Grants e auditoria estrutural

- Revisar `GRANT` de cada tabela: remover `anon` onde não há política pública (audit_logs, price_history, user_roles, price_table_access, profiles, quotes, contacts).
- Auditar chaves estrangeiras e índices: garantir índice em toda FK usada em filtro (product_id, price_table_id, partner_id, category_id, quote_id, user_id) — o filtro de preços por tabela passa a ser caminho quente.

## 4. Storage

- Não há buckets hoje. Criar dois com política explícita:
  - `media` (público): leitura para todos; escrita/remoção só admin/editor.
  - `documents` (privado): leitura e escrita só admin/editor — usado para PDFs de tabela de preço, currículos e arquivos internos.

## 5. Autenticação e rotas administrativas

- O CMS ainda não foi implementado; nesta etapa fica garantido o alicerce: subtree `_authenticated` com gate, e regra de que toda leitura pública do site use o cliente publicável (anon), nunca o cliente admin.
- Revisar `src/lib/site.server.ts`: a consulta de valores públicos passa a filtrar por tabelas públicas e a não retornar preços privados nem em SSR.

## 6. Testes

- Testes de acesso por papel executados via banco (`SET ROLE anon` / claims simulados de editor e admin) confirmando:
  - anônimo não lê nenhuma linha de tabela de preço privada nem seus preços;
  - anônimo não lê conteúdo despublicado;
  - editor lê rascunhos mas não altera papéis nem tabelas de preço;
  - admin tem acesso total.
- Novo Security Scan + linter do banco.

## 7. Relatório e publicação

Ao final, relatório com: tabelas revisadas, políticas alteradas, motivo de cada alteração e resultado do novo scan. Publicação apenas se o scan não apontar findings críticos.

---

### Detalhes técnicos

Tudo em uma migração SQL única e idempotente (`DROP POLICY IF EXISTS` + `CREATE POLICY`), seguida da criação de buckets pela ferramenta de storage e do ajuste das consultas em `src/lib/site.server.ts`. Sem `USING (true)` remanescente em tabela administrativa.
