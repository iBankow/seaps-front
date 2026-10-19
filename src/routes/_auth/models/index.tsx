import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

import { createFileRoute, Link } from "@tanstack/react-router";
import { ModelDetailPanel, ModelsSidebar, useModelsList } from "@/features/models";
import { PageHeader } from "@/components/layout/page-header";
import { Loading } from "@/components/common/loading";

export const Route = createFileRoute("/_auth/models/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading } = useModelsList({ per_page: 100 });
  const models = data?.data ?? [];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (!selectedId && models.length > 0) {
      setSelectedId(models[0].id);
    }
  }, [models, selectedId]);

  const handleSelect = (id: string) => {
    if (id === selectedId) return;
    if (
      hasUnsavedChanges &&
      !window.confirm(
        "Este modelo tem alterações não salvas. Trocar de modelo agora vai descartá-las. Deseja continuar?",
      )
    ) {
      return;
    }
    setHasUnsavedChanges(false);
    setSelectedId(id);
  };

  return (
    <div className="flex flex-1 flex-col gap-3.5">
      <PageHeader eyebrow="Configuração" title="Modelos de checklist">
        <Button asChild className="font-heading uppercase text-xs leading-0">
          <Link to="/models/create">
            <Plus />
            Novo Modelo
          </Link>
        </Button>
      </PageHeader>

      {isLoading ? (
        <Card className="flex h-64 items-center justify-center">
          <Loading size="sm" />
        </Card>
      ) : (
        <div className="grid flex-1 grid-cols-1 items-start gap-3.5 lg:grid-cols-[320px_minmax(0,1fr)]">
          <ModelsSidebar
            models={models}
            selectedId={selectedId}
            onSelect={handleSelect}
            hasUnsavedChanges={hasUnsavedChanges}
          />
          {selectedId ? (
            <ModelDetailPanel
              modelId={selectedId}
              onDirtyChange={setHasUnsavedChanges}
            />
          ) : (
            <Card className="flex h-64 items-center justify-center text-sm text-muted-foreground">
              Nenhum modelo cadastrado ainda.
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
