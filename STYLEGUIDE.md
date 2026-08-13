# Guia de Estilo — Identidade Visual do App Mobile

## 1. Objetivo e contexto

O painel front-end (`seaps-front`) usa shadcn/ui no estado padrão ("cru"): tema neutro definido em `components.json` (`baseColor: neutral`, estilo `radix-nova`) e tokens de cor em `src/styles.css` ainda nos valores default do shadcn (escala de cinza em oklch). O app mobile da SEAPS, em contraste, tem uma identidade visual própria e consistente — header azul-marinho, cards bem arredondados, tipografia em caixa alta e um sistema de cores semânticas para status que se repete em várias telas.

Este documento **extrai e registra** esse estilo a partir de prints do app mobile, para servir de referência quando a migração de estilo do painel for implementada. Ele **não implementa** a migração — nenhum código foi alterado ao criar este documento.

**Importante:** todos os valores de cor, raio e espaçamento abaixo são **estimativas visuais** obtidas por inspeção de screenshots, não de um arquivo-fonte de design (Figma, tokens exportados, etc.). Antes de aplicar qualquer valor em produção, vale confirmar contra a fonte oficial do design do app mobile, se existir. Onde a fonte oficial não existir, os valores aqui podem ser adotados como baseline.

## 2. Paleta de cores

| Token sugerido | Valor estimado | Uso | Token shadcn/CSS atual que substituiria (`src/styles.css`) |
|---|---|---|---|
| `--brand-primary` | `#1B2A6B` | Header/app bar, títulos de seção, texto de destaque, ícones de marca | `--primary` |
| `--brand-primary-foreground` | `#FFFFFF` | Texto/ícones sobre o header | `--primary-foreground` |
| `--background` | `#F0F1F4` | Fundo de tela (fora dos cards) | `--background` |
| `--surface` (card) | `#FFFFFF` | Fundo de cards, listas, inputs | `--card` |
| `--muted-foreground` | `#8A8F98` | Textos secundários (endereço, subtítulo, labels de campo) | `--muted-foreground` |
| `--border` | `#E4E5EA` | Bordas sutis de card/input | `--border` |
| `--accent-soft` | `#E4EBFB` | Fundo do item ativo na navegação (ex.: ícone "home" selecionado) | `--accent` |

## 3. Sistema de cores semânticas de status

Esse sistema se repete de forma consistente em badges de imóvel, badges de checklist e na tela de pontuação de item — vale tratá-lo como um token à parte, não como cor solta por componente.

| Cor | Valor estimado | Significado por contexto |
|---|---|---|
| Verde | `#1FA34D` | Checklist **ABERTO**; pontuação **BOM** |
| Vermelho | `#DC3D3D` | Checklist **FECHADO**; imóvel em **CONCESSÃO**; pontuação **RUIM** |
| Amarelo/creme (fundo `#FBECC0`, texto escuro) | `#FBECC0` / texto `#5C4A12` | Pontuação **REGULAR** |
| Cinza | `#E5E7EB` fundo / texto `#6B7280` | Pontuação **NÃO SE APLICA** |
| Azul (= `--brand-primary`) | `#1B2A6B` | Imóvel **PRÓPRIO** (badge outline) |

Cada cor aparece em dois formatos, dependendo do componente (ver seção 6): **outline** (borda colorida, fundo transparente — usado em badges de imóvel) e **sólido** (fundo colorido cheio — usado em badges de checklist e nas faixas de pontuação).

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

## 7. Notas e limitações

- Valores de cor e medida foram extraídos visualmente de screenshots do app mobile, sujeitos a variação de exibição de tela/compressão de imagem — não são valores de design-system oficiais.
- Recomenda-se validar os hex exatos (e converter para oklch, já que o painel usa oklch em `src/styles.css`) contra uma fonte oficial de design do app mobile, se ela existir, antes de aplicar em produção.
- Este documento é apenas uma referência de estilo; a implementação da migração (atualização de `src/styles.css`, variantes de `badge.tsx`, novo componente de linha de ação, etc.) é um trabalho futuro, fora do escopo desta tarefa.
