## Situação verificada

Medi a seção no preview: nada tem `min-height` nem `grid-rows` fixo. O vazio vem de duas coisas reais:

1. **Colunas desiguais.** O grid é `lg:grid-cols-[1fr_1.1fr] lg:items-start`. A coluna esquerda (título + texto + link + imagem 4:3) mede **773px** de altura; a lista de marcos à direita mede **383px**. Sobram ~390px de roxo vazio à direita, abaixo dos marcos.
2. **Ritmo vertical somado.** As seções "História" e "Diferenciais" usam o mesmo tom roxo e são vizinhas, então o padding inferior de uma soma com o superior da outra — o que aparece como o grande bloco vazio abaixo da imagem, sem nenhuma divisão visual entre as duas seções.

As Correções 2 (dados de contato) e 3 (Galeria duplicada) **já estão aplicadas** no código atual: `BRAND` em `src/lib/brand.ts` já tem os dois telefones, WhatsApp `5521997468686` e Nova Iguaçu — RJ; o JSON-LD do `__root.tsx` já usa Nova Iguaçu/RJ e Rio de Janeiro; e o rodapé já lista "Galeria" uma única vez (vem só da iteração de `NAV`). Nada a fazer nelas.

## O que vou mudar (apenas `src/routes/index.tsx`)

Reorganizar o bloco da História para que a altura seja ditada pelo conteúdo:

```text
antes                             depois
┌──────────┬──────────┐           ┌──────────┬──────────┐
│ título   │ marcos   │           │ título   │ marcos   │
│ link     │ 1988     │           │ link     │ 1988     │
│ ┌──────┐ │ 1996     │           │          │ 1996     │
│ │imagem│ │ 2004     │           │          │ 2004     │
│ └──────┘ │ 2012     │           │          │ 2012     │
│          │  (vazio) │           └──────────┴──────────┘
│  (vazio) │  (vazio) │           ┌─────────────────────┐
└──────────┴──────────┘           │  imagem panorâmica  │
                                  └─────────────────────┘
```

- Tirar a imagem de dentro da coluna esquerda e colocá-la abaixo do grid, em largura total, com proporção panorâmica (16/9 no desktop) — assim as duas colunas passam a ter alturas próximas e não sobra célula vazia.
- Trocar `lg:items-start` por alinhamento que não force altura extra e manter `gap` normal; sem `min-height` em lugar nenhum.
- Manter a imagem visível também no mobile (hoje ela é `hidden lg:block`), já que agora ela ocupa uma faixa própria — sem espaço reservado quando ausente.
- Reduzir o ritmo entre História e Diferenciais: como são dois blocos roxos consecutivos, aplicar `rhythm="sm"` no fim/início desse par para eliminar o dobro de respiro, mantendo o padrão de espaçamento do design system (sem tocar em tokens ou em `section.tsx`).

Conteúdo, textos, número de marcos, tokens, componentes base, server functions e banco permanecem intactos.

## Verificação

Rodar o build e capturar novamente a seção no preview em desktop e mobile para confirmar que não há mais faixa roxa vazia e que os 4 marcos e a imagem seguem lá.
