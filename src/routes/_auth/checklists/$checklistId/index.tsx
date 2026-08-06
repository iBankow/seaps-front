import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useChecklist } from "@/contexts/checklist-context";
import { useMemo } from "react";
import {
  Building,
  User,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Edit,
  FileText,
  History,
  List,
  TrendingUp,
  MinusCircle,
} from "lucide-react";
import { getFirstAndLastName } from "@/lib/utils";
import { StatusBadge } from "@/components/status-badge";
import { useChecklistsItems } from "@/features/checklist-items";
import { formatDateLong } from "@/lib/format";

export const Route = createFileRoute("/_auth/checklists/$checklistId/")({
  component: ChecklistDashboard,
});

function ChecklistDashboard() {
  const { checklist } = useChecklist();

  const { checklistId } = Route.useParams();

  const { data: checklistItems, isLoading } = useChecklistsItems(checklistId);

  const stats = useMemo(() => {
    const items = checklistItems;

    const total_items = items.length;
    const good_items = items.filter((item: any) => item.score === 3).length;
    const regular_items = items.filter((item: any) => item.score === 1).length;
    const bad_items = items.filter((item: any) => item.score === -2).length;
    const na_items = items.filter((item: any) => item.score === 0).length;
    const completed_items = items.filter(
      (item: any) => item.score !== null,
    ).length;

    const total_score = checklist?.score || 0;
    const completion_percentage =
      total_items > 0 ? (completed_items / total_items) * 100 : 0;

    return {
      total_items,
      good_items,
      regular_items,
      bad_items,
      na_items,
      completed_items,
      total_score,
      completion_percentage,
    };
  }, [checklistItems]);

  const getScoreColor = (score: number) => {
    if (score >= 2.5) return "text-green-600";
    if (score >= 1.5) return "text-yellow-600";
    return "text-red-600";
  };

  if (isLoading) {
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
    <div className="space-y-6">
      {/* Mostrar mensagem se o checklist estiver aprovado e quem aprovou */}
      {checklist.status === "APPROVED" && (
        <Card className="dark:bg-purple-900 dark:border-purple-700 bg-purple-50 border-purple-200">
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <p className="text-purple-800 dark:text-purple-300">
                Este checklist foi aprovado por{" "}
                <span className="font-medium">
                  {getFirstAndLastName(checklist.validator?.name)}
                </span>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Itens BOM</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {isLoading ? "..." : stats?.good_items || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Avaliações positivas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Itens REGULAR</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {isLoading ? "..." : stats?.regular_items || 0}
            </div>
            <p className="text-xs text-muted-foreground">Necessitam atenção</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Itens RUIM</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {isLoading ? "..." : stats?.bad_items || 0}
            </div>
            <p className="text-xs text-muted-foreground">Requerem correção</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Itens N/A</CardTitle>
            <MinusCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-500">
              {isLoading ? "..." : stats?.na_items || 0}
            </div>
            <p className="text-xs text-muted-foreground">Não aplicável</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex w-full gap-4">
        {stats && stats.completed_items > 0 && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Resumo da Pontuação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1">
                <span>Pontuação Total</span>
                <span
                  className={`text-2xl font-bold ${getScoreColor(stats.total_score)}`}
                >
                  {stats.total_score.toFixed(2)} pontos
                </span>
              </div>
            </CardContent>
          </Card>
        )}
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Progresso Geral
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading
                ? "..."
                : `${Math.round(stats?.completion_percentage || 0)}%`}
            </div>
            <Progress
              value={stats?.completion_percentage || 0}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {stats?.completed_items || 0} de {stats?.total_items || 0} itens
              avaliados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Property and Evaluation Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Property Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Informações do Imóvel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Nome
                </p>
                <p className="text-lg">{checklist.property?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Endereço
                </p>
                <p>{checklist.property?.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Responsável pelo Imóvel
                </p>
                <p>{checklist.property?.person?.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Evaluation Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Detalhes da Avaliação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Responsável
                </p>
                <p>{checklist.user?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Organização
                </p>
                <p>{checklist.organization?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <p>{StatusBadge({ status: checklist.status })}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Data de Criação
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDateLong(checklist.created_at)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button asChild size="lg">
          <Link to="/checklists/$checklistId/items" params={{ checklistId }}>
            <List className="h-4 w-4 mr-2" />
            Ver Itens
          </Link>
        </Button>

        {checklist.status === "OPEN" && (
          <Button variant="outline" size="lg" asChild>
            <Link to="/checklists/$checklistId/edit" params={{ checklistId }}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Link>
          </Button>
        )}

        <Button variant="outline" size="lg" asChild>
          <Link to="/checklists/$checklistId/history" params={{ checklistId }}>
            <History className="h-4 w-4 mr-2" />
            Histórico
          </Link>
        </Button>

        {checklist.status !== "OPEN" && (
          <Button variant="outline" size="lg" asChild>
            <Link
              to="/checklists/$checklistId/notification"
              params={{ checklistId }}
            >
              <FileText className="h-4 w-4 mr-2" />
              Notificação
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
