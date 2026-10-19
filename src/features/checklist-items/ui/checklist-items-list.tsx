import { Link, useParams } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ChecklistItem } from "../types";

/** Rótulo e tom do badge por pontuação, como no design. */
const SCORE_BADGE: Record<
  string,
  { label: string; variant: "success" | "warning" | "destructive" | "outline" }
> = {
  "3": { label: "BOM", variant: "success" },
  "1": { label: "REGULAR", variant: "warning" },
  "-2": { label: "RUIM", variant: "destructive" },
  "0": { label: "N/A", variant: "outline" },
};

function scoreBadge(score: number | null) {
  if (score === null) return { label: "—", variant: "outline" as const };
  return SCORE_BADGE[String(score)] ?? { label: "—", variant: "outline" as const };
}

export interface ChecklistItemsListProps {
  items: ChecklistItem[];
  /** "14/22 itens" mostrado ao lado do título. */
  progressLabel: string;
}

/**
 * Painel esquerdo do master-detail: cada item leva à sua própria rota, e o item
 * da rota atual fica marcado com a barra na cor da marca.
 */
export function ChecklistItemsList({
  items,
  progressLabel,
}: ChecklistItemsListProps) {
  const { checklistId, itemId } = useParams({ strict: false }) as {
    checklistId: string;
    itemId?: string;
  };

  return (
    <Card className="gap-0 overflow-hidden p-0 min-h-[610px]">
      <div className="flex items-center gap-2 border-b border-border p-[16px_18px]">
        <span className="font-heading text-[11px] font-bold tracking-[0.1em] uppercase">
          Itens do checklist
        </span>
        <span className="ml-auto font-mono text-[11px] text-muted-foreground">
          {progressLabel}
        </span>
      </div>

      <div className="max-h-[560px] overflow-y-auto">
        {items.length === 0 && (
          <p className="p-[18px] text-[13px] text-muted-foreground">
            Nenhum item encontrado para este checklist.
          </p>
        )}

        {items.map((item) => {
          const isSelected = item.id === itemId;
          const badge = scoreBadge(item.score);

          return (
            <Link
              key={item.id}
              to="/checklists/$checklistId/items/$itemId"
              params={{ checklistId, itemId: item.id }}
              resetScroll={false}
              preload={false}
              className={cn(
                "flex items-center gap-2.5 border-b border-border/60 border-l-[3px] p-[13px_18px] transition-colors",
                isSelected
                  ? "border-l-primary bg-secondary"
                  : "border-l-transparent hover:bg-secondary",
              )}
            >
              <span className="font-heading min-w-0 flex-1 text-[12.5px] leading-tight font-semibold tracking-[0.03em] uppercase">
                {item.item?.name}
              </span>
              <Badge variant={badge.variant} className="shrink-0 leading-0">
                {badge.label}
              </Badge>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
