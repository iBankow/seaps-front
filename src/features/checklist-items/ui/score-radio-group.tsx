import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

/** Score values as stored by the API. */
export const SCORE_VALUES = {
  BOM: 3,
  REGULAR: 1,
  RUIM: -2,
  NA: 0,
} as const;

interface ScoreOption {
  value: string;
  label: string;
  /**
   * Unselected = pastel fill + coloured text; selected = solid fill + inverted
   * text. Matches the "Painel SIMP" score control, where the colour carries the
   * meaning before anything is picked.
   */
  className: string;
}

const OPTIONS: ScoreOption[] = [
  {
    value: String(SCORE_VALUES.BOM),
    label: "Bom",
    className:
      "border-success/35 bg-success/10 text-success data-checked:border-success data-checked:bg-success data-checked:text-success-foreground",
  },
  {
    value: String(SCORE_VALUES.REGULAR),
    label: "Regular",
    className:
      "border-warning/40 bg-warning/15 text-warning-foreground data-checked:border-warning data-checked:bg-warning data-checked:text-warning-foreground",
  },
  {
    value: String(SCORE_VALUES.RUIM),
    label: "Ruim",
    className:
      "border-destructive/35 bg-destructive/10 text-destructive data-checked:border-destructive data-checked:bg-destructive data-checked:text-destructive-foreground",
  },
  {
    value: String(SCORE_VALUES.NA),
    label: "Não se aplica",
    className:
      "border-border bg-muted text-muted-foreground data-checked:border-muted-foreground data-checked:bg-muted-foreground data-checked:text-background",
  },
];

export interface ScoreRadioGroupProps {
  /** Current score, as stored by the API. `null`/`undefined` = unanswered. */
  value?: number | null;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * The four-way item rating (BOM / REGULAR / RUIM / NÃO SE APLICA) drawn as
 * colour-coded tiles with a radio dot on the trailing edge.
 */
export function ScoreRadioGroup({
  value,
  onValueChange,
  disabled,
  className,
}: ScoreRadioGroupProps) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn(
        "grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2",
        className,
      )}
      disabled={disabled}
      // String vazia, nunca `undefined`: `undefined` faz o Radix tratar o grupo
      // como não-controlado e guardar a escolha internamente, então ao navegar
      // para um item sem pontuação ele reexibia a pontuação do item anterior.
      // Nenhuma opção usa "", então o grupo continua controlado e sem seleção.
      value={value === null || value === undefined ? "" : String(value)}
      onValueChange={onValueChange}
    >
      {OPTIONS.map((option) => (
        <RadioGroupPrimitive.Item
          key={option.value}
          value={option.value}
          className={cn(
            "font-heading flex cursor-pointer items-center justify-between gap-2 rounded-[9px] border-[1.5px] px-3.5 py-3.5 text-left text-xs font-bold tracking-[0.08em] uppercase outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
            option.className,
          )}
        >
          <span>{option.label}</span>
          <span
            aria-hidden
            className="flex size-[19px] shrink-0 items-center justify-center rounded-full border-2 border-current"
          >
            <RadioGroupPrimitive.Indicator className="size-[9px] rounded-full bg-current" />
          </span>
        </RadioGroupPrimitive.Item>
      ))}
    </RadioGroupPrimitive.Root>
  );
}
