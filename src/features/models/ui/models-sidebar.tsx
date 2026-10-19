import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Model } from "../types";

export interface ModelsSidebarProps {
  models: Model[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** Modelo selecionado tem alterações não salvas — mostra um indicador nele. */
  hasUnsavedChanges?: boolean;
}

/** Lista mestre da tela de Modelos — seleção à esquerda do painel de detalhe. */
export function ModelsSidebar({
  models,
  selectedId,
  onSelect,
  hasUnsavedChanges,
}: ModelsSidebarProps) {
  return (
    <Card className="gap-0 overflow-hidden p-0">
      <div className="border-b border-border px-[18px] py-4">
        <span className="font-heading text-[11px] font-bold tracking-[0.1em] uppercase">
          Modelos
        </span>
      </div>
      {models.length === 0 ? (
        <p className="px-[18px] py-8 text-center text-sm text-muted-foreground">
          Nenhum modelo cadastrado.
        </p>
      ) : (
        <div>
          {models.map((model) => {
            const active = model.id === selectedId;
            const itemCount = Number(model.items_count ?? 0);

            return (
              <button
                key={model.id}
                type="button"
                onClick={() => onSelect(model.id)}
                className={cn(
                  "flex w-full flex-col gap-1 border-b border-border/60 border-l-[3px] px-[18px] py-[15px] text-left transition-colors hover:bg-secondary",
                  active
                    ? "border-l-primary bg-secondary"
                    : "border-l-transparent",
                )}
              >
                <span className="flex items-center gap-1.5 font-heading text-[13px] font-semibold tracking-wide uppercase">
                  {model.name}
                  {active && hasUnsavedChanges && (
                    <span
                      aria-label="Alterações não salvas"
                      title="Alterações não salvas"
                      className="size-1.5 shrink-0 rounded-full bg-warning"
                    />
                  )}
                </span>
                <span className="font-mono text-[10.5px] text-muted-foreground">
                  {model.description || "Sem descrição"} • {itemCount}{" "}
                  {itemCount === 1 ? "item" : "itens"}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </Card>
  );
}
