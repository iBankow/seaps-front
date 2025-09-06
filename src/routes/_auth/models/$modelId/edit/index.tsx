import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { EditModelForm } from "../../-components/form";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_auth/models/$modelId/edit/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { modelId } = Route.useParams();

  const [model, setModel] = useState<any>();
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data } = await api.get(`/api/v1/models/${modelId}`);

        if (data) {
          setModel(data);
        }
      } finally {
        setDataLoading(false);
      }
    };

    loadData();
  }, [modelId]);

  if (dataLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="flex flex-col gap-y-4">
      <Card>
        <CardContent>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/models">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Criar Checklist</h1>
          </div>
        </CardContent>
      </Card>
      <EditModelForm model={model} modelId={modelId} />
    </div>
  );
}
