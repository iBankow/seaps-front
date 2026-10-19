import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { ListChecks } from "lucide-react";

export const Route = createFileRoute("/_auth/checklists/$checklistId/items/")({
  component: ChecklistItemsEmptyState,
});

/** Painel direito antes de qualquer item ser escolhido na lista. */
function ChecklistItemsEmptyState() {
  return (
    <Card className="items-center justify-center gap-3 p-[22px] py-24 text-center min-h-[610px]">
      <ListChecks className="size-8 text-muted-foreground" aria-hidden />
      <p className="font-heading text-[13px] font-semibold tracking-[0.06em] uppercase">
        Selecione um item
      </p>
      <p className="max-w-xs text-[12px] text-muted-foreground">
        Escolha um item na lista ao lado para avaliar a pontuação, enviar
        imagens e registrar observações.
      </p>
    </Card>
  );
}
