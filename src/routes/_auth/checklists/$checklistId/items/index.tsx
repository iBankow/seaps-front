import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useChecklist } from "@/contexts/checklist-context";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { DialogProvider } from "@/contexts/dialog-context";
import { GlobalDialogs } from "@/components/global-dialogs";
import { VirtualizedChecklistGrid } from "@/components/virtualized-checklist-grid";

export const Route = createFileRoute("/_auth/checklists/$checklistId/items/")({
  component: ChecklistContent,
});

function ChecklistContent() {
  const { checklist, error } = useChecklist();

  const [items, setItems] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const { checklistId } = Route.useParams();

  useEffect(() => {
    api
      .get(`api/v1/checklists/${checklistId}/items`)
      .then(({ data }) => setItems(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" disabled>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[400px] animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg text-destructive">{error}</p>
        <Button asChild className="mt-4">
          <Link to="/checklists">Voltar para Checklists</Link>
        </Button>
      </div>
    );
  }

  return (
    <DialogProvider>
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link to="/checklists">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {checklist?.property?.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              Status: {checklist?.status}
            </p>
          </div>
        </div>

        <VirtualizedChecklistGrid
          items={items}
          status={checklist?.status || "OPEN"}
        />

        {items.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-lg text-muted-foreground">
              Nenhum item encontrado para este checklist.
            </p>
          </div>
        )}
      </div>

      {/* Dialogs Centralizados */}
      <GlobalDialogs />
    </DialogProvider>
  );
}
