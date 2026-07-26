## Problema

O cabeçalho hoje exibe 9 links de nível 1 ("A Salgadjén, História, Estrutura, Processos, Parceiros, Grandes Eventos, Produtos, Galeria, Conteúdos") mais botão WhatsApp e botão de orçamento. Em 1070px isso quebra em duas linhas e compete com o logo — sensação de poluição.

## Solução: hierarquia em dois níveis

Menu principal reduzido a 4 itens, sendo um com submenu:

```text
Salgadjén     A Salgadjén ▾    Produtos    Galeria    Conteúdos     [ Solicitar orçamento ]

              └ submenu "A Salgadjén":
                História · Estrutura · Processos · Parceiros · Grandes Eventos
```

- Submenu em painel único (dropdown ancorado, abre no hover/foco e no clique), com título curto + descrição de uma linha em cada item, no ritmo do Design System (cartão `surface-raised`, `shadow-raised`, raio 0.75rem, animação discreta e respeitando `prefers-reduced-motion`).
- Item "A Salgadjén" fica marcado como ativo quando qualquer rota filha estiver aberta.

## Enxugar os elementos à direita

- Remover o botão "WhatsApp" do cabeçalho: ele duplica um caminho já disponível no botão flutuante e no rodapé. Sobra um único CTA — "Solicitar orçamento" —, o que reforça a conversão principal.
- CTA visível a partir de `sm`; abaixo disso, ele aparece no menu mobile.

## Respiro visual

- Aumentar o gap entre logo e nav, alinhar tudo em uma linha só com `min-w-0` no bloco de navegação para nunca quebrar.
- Baixar o breakpoint da navegação desktop de `xl` para `lg` (com 4 itens ela cabe folgada), reduzindo o alcance do menu hambúrguer.
- Manter o comportamento atual de transparência → creme no scroll, apenas com padding levemente menor no estado fixo.

## Mobile

O painel mobile passa a espelhar a mesma hierarquia: bloco "A Salgadjén" com os 5 subitens recuados, depois Produtos, Galeria, Conteúdos, e por fim WhatsApp + Solicitar orçamento.

## Detalhes técnicos

- `src/lib/brand.ts`: reestruturar `NAV` para suportar `children` (rota + label + descrição curta). Manter export de uma lista achatada para o rodapé/sitemap, evitando qualquer regressão em SEO ou links internos.
- `src/components/site/site-header.tsx`: renderizar nav de dois níveis; dropdown acessível (`aria-expanded`, `aria-haspopup`, navegação por teclado, fecha com Esc e ao trocar de rota).
- Sem mudanças em backend, dados ou rotas — apenas apresentação e navegação.
