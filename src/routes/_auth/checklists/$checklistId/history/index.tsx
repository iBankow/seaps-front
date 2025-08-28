import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useChecklist } from "@/contexts/checklist-context";
import { api } from "@/lib/api";
import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { ArrowLeft, Building, MapPin, User } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_auth/checklists/$checklistId/history/")(
  {
    component: RouteComponent,
  }
);

interface ChecklistHistory {
  id: string;
  checklist_id: string;
  checklist_item_id?: string;
  user_id: string;
  status: string;
  action: string;
  observation: string | null;
  old_value: string | null;
  new_value: string | null;
  created_at: string;
}

function RouteComponent() {
  const { checklist } = useChecklist();

  const params = Route.useParams();

  const [history, setHistory] = useState<ChecklistHistory[]>([]);

  useEffect(() => {
    api
      .get(`api/v1/checklists/${params.checklistId}/history`)
      .then((response) => {
        setHistory(response.data);
      });
  }, []);

  return (
    <div className="flex flex-col gap-y-4">
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="..">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-2xl font-bold">
                {checklist?.property?.name}
              </h1>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Informações do Imóvel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Nome</label>
              <p className="text-lg font-semibold">
                {checklist?.property.name}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Tipo</label>
              <div className="mt-1">
                <Badge variant="secondary">status</Badge>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Orgão</label>
              <p className="text-lg">{checklist?.organization?.name}</p>
            </div>

            <Separator />

            <div>
              <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Endereço
              </label>
              <p className="text-lg">{checklist?.property.address}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Historico de Ações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="flex flex-col">
                <span className="text-sm font-medium">{item.action}</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(item.created_at), "dd/MM/yyyy 'às' HH:mm")}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
