import { Card, CardContent } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import { EditModelForm, useModel } from "@/features/models";
import { BackButton } from "@/components/layout/back-button";

export const Route = createFileRoute("/_auth/models/$modelId/edit/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { modelId } = Route.useParams();
  const { data: model, isLoading } = useModel(modelId);

  if (isLoading || !model) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="flex flex-col gap-y-4">
      <Card>
        <CardContent>
          <div className="flex items-center gap-2">
            <BackButton />
            <h1 className="font-heading text-xl font-bold tracking-wide uppercase">
              Editar Modelo
            </h1>
          </div>
        </CardContent>
      </Card>
      <EditModelForm model={model} modelId={modelId} />
    </div>
  );
}
