import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useChecklist } from "@/contexts/checklist-context";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Building,
  User,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MinusCircle,
  Edit,
  History,
  List,
  TrendingUp,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ChecklistStats {
  total_items: number;
  good_items: number;
  regular_items: number;
  bad_items: number;
  na_items: number;
  completed_items: number;
  total_score: number;
  completion_percentage: number;
}

export const Route = createFileRoute("/_auth/checklists/$checklistId/")({
  component: ChecklistDashboard,
});

function ChecklistDashboard() {
  const { checklist } = useChecklist();
  const [stats, setStats] = useState<ChecklistStats | null>(null);
  const [loading, setLoading] = useState(true);

  const { checklistId } = Route.useParams();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get(
          `/api/v1/checklists/${checklistId}/items`
        );
        const items = response.data;

        const total_items = items.length;
        const good_items = items.filter((item: any) => item.score === 3).length;
        const regular_items = items.filter(
          (item: any) => item.score === 1
        ).length;
        const bad_items = items.filter((item: any) => item.score === -2).length;
        const na_items = items.filter((item: any) => item.score === 0).length;
        const completed_items = items.filter(
          (item: any) => item.score !== null
        ).length;

        const total_score = checklist?.score || 0;
        const completion_percentage =
          total_items > 0 ? (completed_items / total_items) * 100 : 0;

        setStats({
          total_items,
          good_items,
          regular_items,
          bad_items,
          na_items,
          completed_items,
          total_score,
          completion_percentage,
        });
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [checklistId]);

  const getScoreColor = (score: number) => {
    if (score >= 2.5) return "text-green-600";
    if (score >= 1.5) return "text-yellow-600";
    return "text-red-600";
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
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Progresso Geral
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Itens BOM</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {loading ? "..." : stats?.good_items || 0}
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
              {loading ? "..." : stats?.regular_items || 0}
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
              {loading ? "..." : stats?.bad_items || 0}
            </div>
            <p className="text-xs text-muted-foreground">Requerem correção</p>
          </CardContent>
        </Card>
      </div>

      {/* Property and Evaluation Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <p>{checklist.status}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Data de Criação
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {format(
                    new Date(checklist.created_at),
                    "dd 'de' MMMM 'de' yyyy",
                    { locale: ptBR }
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Score Summary */}
      {stats && stats.completed_items > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resumo da Pontuação</CardTitle>
            <CardDescription>
              Análise detalhada do desempenho do checklist
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Pontuação Total</span>
                <span
                  className={`text-2xl font-bold ${getScoreColor(stats.total_score)}`}
                >
                  {stats.total_score.toFixed(2)} pontos
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto mb-1" />
                  <p className="font-medium text-green-800 dark:text-green-200">
                    {stats.good_items}
                  </p>
                  <p className="text-green-600">BOM</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mx-auto mb-1" />
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">
                    {stats.regular_items}
                  </p>
                  <p className="text-yellow-600">REGULAR</p>
                </div>
                <div className="text-center p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                  <XCircle className="h-5 w-5 text-red-600 mx-auto mb-1" />
                  <p className="font-medium text-red-800 dark:text-red-200">
                    {stats.bad_items}
                  </p>
                  <p className="text-red-600">RUIM</p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-950 rounded-lg">
                  <MinusCircle className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {stats.na_items}
                  </p>
                  <p className="text-gray-600">N/A</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
      </div>
    </div>
  );
}
