# SEAPS Front — conventions for building with this design system

This is a shadcn/ui-based Tailwind v4 component library (radix-nova style) pulled directly from the `seaps-front` app. Every component ships pre-styled — no theme provider is required for light mode.

## Styling idiom: Tailwind utility classes over CSS custom-property tokens

Style compositions with Tailwind utility classes, never inline styles or hand-written CSS. Every class resolves against the real tokens below (defined in `styles.css`'s `@import` closure).

**Semantic color tokens** (each has a `bg-*`, `text-*`, and `border-*` utility; each also has a matching `-foreground` pair for text/icons placed on top of it):

| Token | Utility class | Use |
|---|---|---|
| `primary` | `bg-primary` / `text-primary` | Brand navy — primary actions, links |
| `secondary` | `bg-secondary` / `text-secondary` | Secondary buttons/badges |
| `card` | `bg-card` | Card/panel surfaces |
| `popover` | `bg-popover` | Dialogs, dropdowns, tooltips, popovers |
| `muted` | `bg-muted` / `text-muted-foreground` | Subdued backgrounds, secondary text |
| `accent` | `bg-accent` | Hover/active highlight |
| `destructive` | `bg-destructive` / `text-destructive` | Delete/danger actions |
| `success` | `bg-success` / `text-success-foreground` | Positive status |
| `warning` | `bg-warning` / `text-warning-foreground` | Caution status |
| `border` / `input` / `ring` | `border-border`, `border-input`, `ring-ring` | Borders and focus rings |

Don't invent new token names — these are the complete set. For a color not covered (info, neutral gray, etc.), fall back to Tailwind's stock palette (`bg-blue-50`, `text-blue-700`, etc. — see `Chip`'s `info` variant for the pattern) rather than adding a new CSS variable.

**Radius**: use the `rounded-*` scale, not arbitrary values — `rounded-lg` (buttons/inputs), `rounded-xl` (cards/dialogs), `rounded-2xl`/`rounded-3xl` (larger surfaces), `rounded-full` (avatars, pills, badges, switches). Backed by `--radius` (0.85rem) plus derived `--radius-sm/md/lg/xl/2xl/3xl/4xl`.

**Typography**: body font is "Inter Variable" (`font-sans`, already the default — no class needed). Headings/titles use `font-heading` (same family, just the semantic slot shadcn's `CardTitle`/`DialogTitle`/etc. already apply internally).

## Where the real styles live

- `styles.css` at the bundle root — imports the token `:root`/`.dark` blocks and `_ds_bundle.css` (the compiled component CSS). This is the complete closure a rendered design receives.
- `_ds_bundle.css` — every Tailwind utility class actually used across the library, plus the `@font-face` rules for Inter Variable.
- Per-component `.prompt.md` files — usage notes and the real prop types extracted from source.

Dark mode: add a `.dark` class to a wrapping element — every token flips automatically (no JS/provider needed, it's pure CSS).

## Composition example

A real composed pattern from this library — a status card (adapt freely, don't invent new surface treatments):

```tsx
<Card className="w-80">
  <CardHeader>
    <CardTitle>Detran/MT — 0200/26</CardTitle>
    <CardDescription>Av. Historiador Rubens de Mendonça, 1731</CardDescription>
    <CardAction>
      <Badge>Aberto</Badge>
    </CardAction>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-muted-foreground">
      Checklist criado em 12/08/2026, com 18 itens vistoriados de 24.
    </p>
  </CardContent>
  <CardFooter>
    <Button variant="outline" className="w-full">Ver checklist</Button>
  </CardFooter>
</Card>
```

`Button` variants: `default` (primary navy), `outline`, `secondary`, `ghost`, `destructive`, `link`. Sizes: `xs`, `sm`, `default`, `lg`, `icon` (+ `icon-xs`/`icon-sm`/`icon-lg`).

## Compound components

Many components (Dialog, AlertDialog, Sheet, Drawer, Select, DropdownMenu, Popover, Table, Sidebar, Card, Field, etc.) are Radix-based compounds with many named sub-parts (`DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogFooter`, ...). Always compose the full set from the same family — never mix a `Dialog`'s parts with a different overlay's, and don't render a sub-part (e.g. `TableCell`) outside its real parent structure.
