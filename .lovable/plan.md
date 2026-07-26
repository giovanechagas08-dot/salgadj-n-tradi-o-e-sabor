## Objetivo

Entregar a base do painel administrativo: login real, proteção das rotas `/admin` e a tela de edição de preços dos 49 sabores nas 3 tabelas de preço.

## Acesso

Hoje nenhum usuário tem papel atribuído. Vou:

1. Criar a conta `giovane.chagas08@gmail.com` no login do sistema com uma senha temporária (que informo no fim e você troca depois).
2. Atribuir a essa conta o papel **admin** na tabela de papéis.

Nenhuma função de segurança (`has_role`, `is_admin`, `can_edit`) nem política existente será alterada.

## Parte A — Login e proteção

- `/admin/login`: formulário e-mail + senha (Supabase Auth), erros amigáveis, redireciona para `/admin` ao entrar. Rota pública, `noindex`.
- `/admin` como rota-mãe protegida (layout sem renderização no servidor, para ler a sessão do navegador):
  - sem sessão → redireciona para `/admin/login`;
  - com sessão mas sem papel admin/editor → tela "Acesso não autorizado" + botão sair, sem carregar dado nenhum;
  - com papel → libera o conteúdo.
- Verificação de papel via a função de permissão já existente no banco, chamada como o usuário autenticado.
- Layout admin: barra lateral com **Preços** (ativo) e **Pedidos** / **Produtos** marcados como "em breve", cabeçalho com e-mail do usuário e botão Sair (limpa cache e volta ao login).
- Rotas admin ficam fora da navegação pública e com `noindex`.

## Parte B — `/admin/precos`

- Seletor/abas com as 3 tabelas: **Varejo**, **Revenda — congelado para fritar**, **Revenda — congelado para assar**.
- Lista organizada pelos 15 grupos: cabeçalho com o nome do grupo e o rótulo da unidade de cotação (pacote de 50 / unidade); abaixo, cada sabor com seu `flavor_name` e um campo de preço em R$.
- Campo vazio quando não há preço para aquele par sabor+tabela; ao salvar, cria o registro.
- Validação: número ≥ 0, com centavos; valor inválido bloqueia o salvamento com aviso no campo.
- Botão **Salvar** por grupo e um **Salvar tudo** fixo no rodapé; grava só o que mudou.
- Histórico continua sendo gravado automaticamente pelo gatilho existente — nada de novo aí.
- Confirmações e erros via toast (sonner).

## Detalhes técnicos

- Rotas novas: `src/routes/admin/route.tsx` (gate, `ssr: false`), `src/routes/admin/index.tsx` (redireciona para preços), `src/routes/admin/login.tsx`, `src/routes/admin/precos.tsx`, além de `src/components/admin/*` (shell, sidebar, editor de preços).
- Leituras e escritas via cliente Supabase do navegador, como o usuário autenticado — RLS continua sendo a defesa real. Sem service role no cliente.
- Upsert em `product_prices` por (`product_id`, `price_table_id`), em lote por grupo.
- shadcn/ui já existente (input, button, tabs, table, card) + `sonner`. Componentes `ui` que faltarem serão adicionados isoladamente, sem tocar em tokens, design system ou páginas públicas.
- Nenhuma alteração em loaders/server functions públicos nem em migrações de segurança.

## Entrega final

Login funcional, `/admin` protegida por sessão + papel, sua conta com papel admin (com a senha temporária informada) e a tela de preços operando sobre as 3 tabelas.
