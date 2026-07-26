## Parte A — Campo de status (verificado)

`quotes` **já tem** a coluna `status text not null default 'novo'`, e a policy `admin manage quotes` (UPDATE) já permite escrita para admin/editor via `can_edit(auth.uid())`. **Não haverá migração nem coluna nova.** Convenção: `'atendido'` = atendido; qualquer outro valor (`'novo'`, etc.) = não atendido.

Observação: hoje a tabela `quotes` está vazia (nenhum pedido recebido ainda), então a tela deve tratar bem o estado vazio.

## Parte B — Lista `/admin/pedidos`

Nova rota filha do gate admin existente (mesma proteção de sessão + `can_edit`).

- Leitura como usuário autenticado pelo cliente do navegador (RLS aplicada), com TanStack Query.
- Consulta: `quotes` ordenado por `created_at` desc, trazendo a contagem de `quote_items` junto.
- Colunas: data de criação, nome, empresa, telefone, tipo de operação/evento, nº de itens, selo de status (Atendido / Não atendido em cores distintas).
- Filtro por status (todos / não atendidos / atendidos) e busca por nome ou telefone (filtragem no cliente sobre a lista carregada).
- Linhas não atendidas com destaque leve para priorização.
- Estado vazio explicativo quando não houver pedidos.

## Parte C — Detalhe

Rota `/admin/pedidos/$id`:

- Dados do cliente: nome, telefone com link para WhatsApp via `whatsappLink()`, e-mail, empresa, cidade, tipo de operação, data do evento, convidados, mensagem, data de envio.
- Itens de `quote_items`: nome do produto/sabor, quantidade e unidade, em tabela legível.
- Botão que alterna entre `'atendido'` e `'novo'`, com toast (sonner) e invalidação da query para refletir na lista imediatamente.

## Navegação

Em `src/routes/admin/route.tsx`, o item "Pedidos" deixa de ser "em breve" e passa a apontar para `/admin/pedidos`.

## Técnico

- Arquivos novos: `src/routes/admin/pedidos.index.tsx` e `src/routes/admin/pedidos.$id.tsx`; ajuste pontual em `src/routes/admin/route.tsx`.
- Componentes shadcn/ui existentes (table, card, badge, button, select), responsivo desktop/tablet.
- Sem service role no cliente, sem alterar `submit_quote`, funções SECURITY DEFINER, policies, páginas públicas ou o design system.
