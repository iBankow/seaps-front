import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useChecklist } from "@/contexts/checklist-context";
import { api } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { Building, MapPin, User } from "lucide-react";
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Informações do Imóvel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <Building className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nome do Imóvel</p>
                <p className="font-medium">{checklist?.property?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 dark:bg-green-950 rounded-lg">
                <MapPin className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Endereço</p>
                <p className="font-medium">{checklist?.property?.address}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Organização</p>
                <p className="font-medium">{checklist?.organization?.name}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Timeline de Atividades
          </CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Nenhuma atividade registrada ainda.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {history.map((item, index) => (
                <div key={item.id} className="relative">
                  {index !== history.length - 1 && (
                    <div className="absolute left-4 top-8 w-0.5 h-16 bg-border" />
                  )}

                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                      {index + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="text-sm font-medium">{item.action}</h4>
                          <p className="text-sm text-muted-foreground">
                            {format(
                              new Date(item.created_at),
                              "dd/MM/yyyy 'às' HH:mm"
                            )}
                          </p>
                        </div>
                        <Badge
                          variant={
                            item.status === "BOM"
                              ? "default"
                              : item.status === "REGULAR"
                                ? "secondary"
                                : item.status === "RUIM"
                                  ? "destructive"
                                  : "outline"
                          }
                        >
                          {item.status || "Sistema"}
                        </Badge>
                      </div>

                      {item.observation && (
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="text-sm">{item.observation}</p>
                        </div>
                      )}

                      {(item.old_value || item.new_value) && (
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                          {item.old_value && (
                            <div className="text-sm">
                              <span className="text-muted-foreground">
                                Valor anterior:
                              </span>
                              <span className="ml-2 font-mono bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200 px-2 py-1 rounded">
                                {item.old_value}
                              </span>
                            </div>
                          )}
                          {item.new_value && (
                            <div className="text-sm">
                              <span className="text-muted-foreground">
                                Novo valor:
                              </span>
                              <span className="ml-2 font-mono bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                                {item.new_value}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
