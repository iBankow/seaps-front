import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MinusCircle,
  TrendingUp,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useChecklist } from "@/contexts/checklist-context";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { DialogProvider } from "@/contexts/dialog-context";
import { GlobalDialogs } from "@/components/global-dialogs";
import { VirtualizedChecklistGrid } from "@/components/virtualized-checklist-grid";

interface ItemStats {
  total: number;
  good: number;
  regular: number;
  bad: number;
  na: number;
  completed: number;
  completion_percentage: number;
}

export const Route = createFileRoute("/_auth/checklists/$checklistId/items/")({
  component: ChecklistContent,
});

function ChecklistContent() {
  const { checklist, error } = useChecklist();

  const [items, setItems] = useState<any[]>([]);
  const [stats, setStats] = useState<ItemStats>({
    total: 0,
    good: 0,
    regular: 0,
    bad: 0,
    na: 0,
    completed: 0,
    completion_percentage: 0,
  });

  const [loading, setLoading] = useState(true);

  const { checklistId } = Route.useParams();

  useEffect(() => {
    api
      .get(`api/v1/checklists/${checklistId}/items`)
      .then(({ data }) => {
        setItems(data);

        // Calcular estatísticas
        const total = data.length;
        const good = data.filter((item: any) => item.score === 3).length;
        const regular = data.filter((item: any) => item.score === 1).length;
        const bad = data.filter((item: any) => item.score === -2).length;
        const na = data.filter((item: any) => item.score === 0).length;
        const completed = data.filter(
          (item: any) => item.score !== null
        ).length;
        const completion_percentage = total > 0 ? (completed / total) * 100 : 0;

        console.log(completion_percentage);

        setStats({
          total,
          good,
          regular,
          bad,
          na,
          completed,
          completion_percentage,
        });
      })
      .finally(() => setLoading(false));
  }, [checklistId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                <div className="h-4 w-4 animate-pulse rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-12 animate-pulse rounded bg-muted mb-2" />
                <div className="h-3 w-20 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Items Skeleton */}
        <Card>
          <CardHeader>
            <div className="h-6 w-32 animate-pulse rounded bg-muted mb-2" />
            <div className="h-4 w-64 animate-pulse rounded bg-muted" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[400px] animate-pulse rounded-lg bg-muted"
                />
              ))}
            </div>
          </CardContent>
        </Card>
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
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progresso</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(stats.completion_percentage)}%
              </div>
              <Progress value={stats.completion_percentage} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {stats.completed}/{stats.total} itens
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400">
                BOM
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.good}
              </div>
              <p className="text-xs text-green-600">Excelente</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                REGULAR
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.regular}
              </div>
              <p className="text-xs text-yellow-600">Atenção</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700 dark:text-red-400">
                RUIM
              </CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.bad}</div>
              <p className="text-xs text-red-600">Correção</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-400">
                N/A
              </CardTitle>
              <MinusCircle className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{stats.na}</div>
              <p className="text-xs text-gray-600">Não aplicável</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Itens</p>
            </CardContent>
          </Card>
        </div>

        {/* Checklist Items */}
        <Card>
          <CardHeader>
            <CardTitle>Itens do Checklist</CardTitle>
            <CardDescription>
              Avalie cada item conforme os critérios estabelecidos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {items.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-lg text-muted-foreground">
                  Nenhum item encontrado para este checklist.
                </p>
              </div>
            ) : (
              <VirtualizedChecklistGrid
                items={items}
                status={checklist?.status || "OPEN"}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialogs Centralizados */}
      <GlobalDialogs />
    </DialogProvider>
  );
}
