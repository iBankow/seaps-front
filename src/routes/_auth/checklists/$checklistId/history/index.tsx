import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  user?: {
    id: string;
    name: string;
    email: string;
  };
  item?: {
    name: string;
  };
  status: string;
  action: string;
  observation: string | null;
  value: Record<string, any> | null;
  created_at: string;
}

// Helper function to format JSON values
const formatJsonValue = (value: Record<string, any> | null): string => {
  if (!value || Object.keys(value).length === 0) return "-";

  // Try to extract meaningful information from common JSON structures
  if (typeof value === "object") {
    // If it's a simple object with a few key-value pairs
    const entries = Object.entries(value);

    if (entries.length <= 2) {
      // Show simple key-value pairs directly
      return entries
        .map(
          ([key, val]) =>
            `${key}: ${String(val).substring(0, 20)}${String(val).length > 20 ? "..." : ""}`
        )
        .join(", ");
    } else {
      // Show number of properties for complex objects
      return `{${entries.length} propriedades}`;
    }
  }

  // Fallback for other types
  const stringified = String(value);
  return stringified.length > 30
    ? `${stringified.substring(0, 30)}...`
    : stringified;
};

// Helper function to get full JSON for tooltip/modal
const getFullJsonString = (value: Record<string, any> | null): string => {
  if (!value) return "Nenhum valor";
  return JSON.stringify(value, null, 2);
};

// Action translations
const getActionTranslation = (action: string): string => {
  const translations: { [key: string]: string } = {
    "checklist:reopen": "Checklist Reaberto",
    "checklist_item:updated": "Item Atualizado",
    "checklist_item:update": "Item Atualizado",
    "checklist:create": "Checklist Criado",
    "checklist:finish": "Checklist Finalizado",
    "checklist:updated": "Checklist Atualizado",
    "checklist:deleted": "Checklist Removido",
    "checklist:re_open": "Checklist Reaberto",
    "checklist_item:upload_images": "Imagens Enviadas",
  };

  return translations[action] || action;
};

// Status badge variant helper
const getStatusVariant = (status: string) => {
  switch (status) {
    case "BOM":
    case "APPROVED":
      return "default";
    case "REGULAR":
    case "OPEN":
      return "secondary";
    case "RUIM":
    case "REJECTED":
      return "destructive";
    case "CLOSED":
      return "outline";
    default:
      return "outline";
  }
};

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

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Histórico de Atividades
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
            <div className="overflow-hidden rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ação</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Usuário
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Data/Hora
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Observação
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Valores
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium">
                          {getActionTranslation(item.action)}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="text-sm">
                          <div className="font-medium">
                            {item.user?.name || "Sistema"}
                          </div>
                          {item.user?.email && (
                            <div className="text-muted-foreground text-xs">
                              {item.user.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(item.status)}>
                          {item.status || "Sistema"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="text-sm text-muted-foreground">
                          {format(
                            new Date(item.created_at),
                            "dd/MM/yyyy 'às' HH:mm"
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {item.observation ? (
                          <div className="max-w-xs truncate text-sm">
                            {item.observation}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {item.value ? (
                          <div className="space-y-1">
                            <div className="text-xs">
                              {item.checklist_item_id && item.item?.name && (
                                <div className="text-muted-foreground mb-1">
                                  {item.item.name}
                                </div>
                              )}
                              <div
                                className="inline-block cursor-help max-w-[200px]"
                                title={getFullJsonString(item.value)}
                              >
                                <span className="font-mono bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs border">
                                  {formatJsonValue(item.value)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
