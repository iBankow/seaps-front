import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useChecklist } from "@/contexts/checklist-context";
import { MapPin } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BackButton } from "@/components/back-button";

export const ChecklistHeader = () => {
  const { checklist } = useChecklist();

  const getStatusBadge = (status: string) => {
    const variants = {
      OPEN: { variant: "default" as const, label: "Aberto" },
      CLOSED: { variant: "secondary" as const, label: "Finalizado" },
      CANCELED: { variant: "destructive" as const, label: "Cancelado" },
    };

    const config = variants[status as keyof typeof variants] || {
      variant: "default" as const,
      label: status,
    };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (!checklist) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando checklist...</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="mb-6">
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BackButton variant={"outline"} />
            <div>
              <h1 className="text-3xl font-bold">{checklist.property?.name}</h1>
              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4" />
                {checklist.property?.address}
              </p>
            </div>
          </div>
          <div className="text-right">
            {getStatusBadge(checklist.status)}
            <p className="text-sm text-muted-foreground mt-1">
              Criado em{" "}
              {format(new Date(checklist.created_at), "dd/MM/yyyy", {
                locale: ptBR,
              })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
