# Guia de Estilo — Painel SIMP

## 1. Objetivo e contexto

Este documento descreve a identidade visual **implementada** no painel
(`seaps-front`), derivada do design `Painel SIMP.dc.html` (projeto Claude
Design "Painel web SIMP completo") e alinhada ao app mobile da SEAPS.

O painel **não** usa mais o tema neutro padrão do shadcn. Os tokens em
`src/styles.css` estão na paleta SIMP (navy `#17307d` / verde `#00a651`), com
tipografia Archivo (títulos) + IBM Plex Sans (corpo) + IBM Plex Mono (labels e
números).

**Regra prática:** nenhuma cor crua da escala Tailwind (`text-green-600`,
`bg-blue-50`, `border-red-200`…) deve entrar no código. Toda cor sai de um
token semântico. Se faltar um token para o caso, adicione o token em
`src/styles.css` em vez de usar a escala crua.

## 2. Paleta de cores

Definida em `:root` e `.dark` de `src/styles.css`, exposta ao Tailwind via
`@theme inline`.

| Token | Valor (claro) | Uso |
|---|---|---|
| `--primary` | `#17307d` | Marca, sidebar, títulos de destaque, barras de progresso |
| `--primary-foreground` | `#FFFFFF` | Texto/ícones sobre o navy |
| `--background` | `#eef1f5` | Fundo de tela (fora dos cards) |
| `--card` | `#FFFFFF` | Fundo de cards, listas, inputs |
| `--foreground` | `#10204d` | Texto principal |
| `--muted-foreground` | `#6b7896` | Textos secundários (endereço, subtítulo, labels) |
| `--border` | `#e3e8f1` | Bordas sutis de card |
| `--input` | `#dbe1ec` | Bordas de campo |
| `--secondary` | `#f7f9fc` | Fundo de campo, linha de tabela em hover |
| `--sidebar` | `#17307d` | Sidebar sólida navy |

## 3. Sistema de cores semânticas de status

Esse sistema se repete em badges de imóvel, badges de checklist e no controle
de pontuação de item. Cada significado tem um token próprio.

| Token | Valor (claro) | Significado por contexto |
|---|---|---|
| `--success` | `#00a651` | Checklist **ABERTO**; pontuação **BOM** |
| `--destructive` | `#dc2626` | Checklist **FECHADO**; imóvel em **CONCESSÃO**; pontuação **RUIM** |
| `--warning` / `--warning-foreground` | `#e0a800` / `#4a3300` | Pontuação **REGULAR** |
| `--muted-foreground` | `#6b7896` | Pontuação **NÃO SE APLICA** |
| `--validated` | `#6d28d9` | Checklist **VALIDADO/APROVADO** |

Cada cor aparece em dois formatos: **suave** (`bg-<token>/10` +
`border-<token>/35` + `text-<token>`) para o estado de repouso, e **sólido**
(`bg-<token>` + foreground invertido) para o estado selecionado/ativo. O
mapeamento status → tom vive em `src/features/checklists/ui/status-colors.ts`.

## 4. Tipografia

- **Família observada no mobile**: sans-serif grotesca/condensada (aparência tipo Helvetica Neue Condensed / similar). O painel hoje usa **Inter Variable** (`@fontsource-variable/inter`, ver `src/styles.css`) — são famílias diferentes; decisão de trocar ou não a fonte do painel fica em aberto para quando a migração for planejada.
- **Uso de caixa alta**: hierarquia é construída mais por **peso + caixa alta** do que por tamanho. Títulos de seção ("AÇÕES RÁPIDAS:", "PONTUAÇÃO:"), nomes de imóveis/órgãos, labels de campo ("ORGÃO:", "LOCAL:") e badges são quase todos uppercase bold.
- **Escala aproximada por papel**:
  - Título de header/app bar: bold, ~18–20px, uppercase, branco.
  - Título de seção (ex. "CHECKLIST RECENTES:"): bold, ~14–16px, uppercase, cor primária.
  - Título de card/item (nome do imóvel, nome do local): bold, ~16–18px, mixed/uppercase, cor primária escura.
  - Corpo/subtítulo (endereço, descrição): regular, ~13–14px, cinza (`--muted-foreground`).
  - Label de campo (ex. "CRIADO EM:"): regular/uppercase pequeno, ~11–12px, cinza.
  - Badge: bold, ~11–12px, uppercase.

## 5. Raios, espaçamento e elevação

- **Raio de borda**: os cards, badges e inputs do mobile usam um raio visivelmente maior que o padrão atual do painel (`--radius: 0.625rem` ≈ 10px). Estimativa:
  - Cards de lista/detalhe: ~16–20px (`rounded-2xl`/`rounded-3xl`).
  - Badges e pílulas (busca, nav): totalmente arredondado (`rounded-full`).
  - Botões/quadrados de ícone: ~12px (`rounded-xl`).
- **Sombra**: sombra suave e discreta nos cards e na barra de navegação flutuante (`shadow-sm`/`shadow-md`, sem contorno forte).
- **Espaçamento interno**: cards com padding generoso (~16px), boa separação vertical entre itens de lista (~12px de gap).

## 6. Especificações de componente

### Header / App bar
- Barra sólida na cor `--brand-primary`, ocupando a largura toda.
- Título uppercase bold branco à esquerda (ou centralizado com botão de voltar); ação secundária (ícone) à direita.
- Em telas de detalhe, uma **barra fina de acento** (linha de ~3–4px) aparece logo abaixo do header, na cor do status daquele registro (ex. verde quando o checklist está "ABERTO").
- Mapeamento: `src/components/layout/site-header.tsx`.

### Badge de status
- **Outline**: borda ~1.5–2px na cor do status, fundo transparente/branco, texto na mesma cor, uppercase bold, `rounded-full`. Usado para classificação de imóvel (PRÓPRIO/CONCESSÃO).
- **Sólido**: fundo cheio na cor do status (ou pastel, no caso do amarelo/cinza), texto branco ou escuro conforme contraste, mesma forma. Usado para status de checklist (ABERTO/FECHADO) e pontuação (BOM/REGULAR/RUIM/N-A).
- Mapeamento: `src/components/ui/badge.tsx`, `src/features/checklists/ui/status-badge.tsx`, `src/features/checklists/ui/classification-badge.tsx`.

### Card de lista (imóvel, checklist, item de imagem)
- Container branco `rounded-2xl` com sombra suave.
- Linha superior: label pequeno em cinza (código/órgão, ex. "0200/26 - DETRAN") à esquerda + badge de status alinhado à direita.
- Título grande bold logo abaixo.
- Subtítulo em cinza (endereço) quando aplicável.
- Ação à direita (editar/avançar) como botão quadrado `rounded-xl` cinza-claro com ícone.
- Mapeamento: `src/components/ui/card.tsx`, `src/features/checklist-items/ui/checklist-card.tsx`.

### Linha de ação com ícone
- Padrão usado tanto nas "Ações rápidas" da home quanto nas "Ações" de um checklist/item (ITENS, RELATÓRIO, FINALIZAR, IMAGENS, OBSERVAÇÕES).
- Ícone dentro de um quadrado `rounded-xl` claro à esquerda + título bold + subtítulo cinza descritivo, em uma linha horizontal.
- Estado desabilitado: ícone, título e subtítulo em cinza apagado (ex. "RELATÓRIO" quando o checklist ainda está aberto).
- Não há primitivo equivalente hoje no painel — candidato a um novo componente (ex. `action-list-item`), possivelmente composto sobre `card.tsx` + `button.tsx`.

### Grupo de pontuação (segmented semantic control)
- Um único container arredondado dividido em faixas horizontais de cor sólida (verde/amarelo/vermelho/cinza), uma por opção (BOM/REGULAR/RUIM/NÃO SE APLICA).
- Cada faixa ocupa a largura toda, com um rádio circular alinhado à direita (vazio quando não selecionado, com anel/preenchimento quando selecionado).
- Funcionalmente é um radio group, mas visualmente não se parece em nada com um radio list neutro — a cor da opção já comunica o significado antes da seleção.
- Mapeamento: `src/components/ui/radio-group.tsx` (precisaria de variante com fundo colorido por opção).

### Campo de busca
- Input `rounded-full`, borda sutil cinza, ícone de lupa à esquerda, placeholder cinza (ex. "Procure pelo Imóvel").
- Mapeamento: `src/components/ui/input.tsx`.

### Navegação
- Mobile usa uma **bottom navigation** flutuante: pílula branca com sombra, 3 ícones (home/checklists/imóveis), item ativo com fundo azul-claro (`--accent-soft`) arredondado atrás do ícone.
- O painel desktop usa **sidebar** (`src/components/ui/sidebar.tsx`), um padrão de navegação diferente por natureza (lateral, com labels, colapsável) — a bottom nav não deve ser copiada 1:1, mas o **tratamento visual do item ativo** (fundo suave arredondado atrás do ícone/label) é o elemento reaproveitável para o item ativo da sidebar.

## 7. Primitivos compartilhados

Peças recorrentes do design já extraídas para reuso:

| Componente | Papel |
|---|---|
| `components/common/stat-card.tsx` | KPI: label mono + número Archivo grande, colorido por `tone` |
| `components/common/meta-field.tsx` | Par label mono uppercase + valor, base das telas de detalhe |
| `components/common/section-label.tsx` | Caption mono que abre uma seção dentro de um card (com hint/ação) |
| `components/layout/page-header.tsx` | Cabeçalho de página: eyebrow + título + ações |
| `features/checklist-items/ui/score-radio-group.tsx` | Controle BOM/REGULAR/RUIM/N-A em tiles coloridos |
| `components/ui/progress.tsx` | Barra de progresso com `tone` (primary/success/warning/destructive) |

Antes de escrever um bloco novo com label mono + valor, ou mais um cartão de
número, verifique se um destes já cobre o caso.

## 8. Notas e limitações

- As medidas de espaçamento/raio do app mobile na seção 5 continuam sendo
  estimativas visuais de screenshots; as **cores** e a **tipografia**, não —
  essas vêm do design `Painel SIMP.dc.html`.
- O tema escuro é uma adaptação da paleta SIMP, não veio do design original
  (que só define o tema claro). Vale validar contraste ao evoluí-lo.
