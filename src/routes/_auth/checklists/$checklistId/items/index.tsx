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
import { DialogProvider } from "@/contexts/dialog-context";
import {
  GlobalDialogs,
  VirtualizedChecklistGrid,
  useChecklistsItems,
} from "@/features/checklist-items";

export const Route = createFileRoute("/_auth/checklists/$checklistId/items/")({
  component: ChecklistContent,
});

function ChecklistContent() {
  const { checklist, error } = useChecklist();
  const { checklistId } = Route.useParams();

  const { data: items, isLoading: loading } = useChecklistsItems(checklistId);

  const total = items.length;
  const good = items.filter((item) => item.score === 3).length;
  const regular = items.filter((item) => item.score === 1).length;
  const bad = items.filter((item) => item.score === -2).length;
  const na = items.filter((item) => item.score === 0).length;
  const completed = items.filter((item) => item.score !== null).length;
  const completion_percentage = total > 0 ? (completed / total) * 100 : 0;

  const stats = {
    total,
    good,
    regular,
    bad,
    na,
    completed,
    completion_percentage,
  };

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
              <CardTitle className="font-mono text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
                Progresso
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-heading text-2xl font-bold">
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
              <CardTitle className="font-mono text-[10px] font-medium tracking-widest text-success uppercase">
                BOM
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="font-heading text-2xl font-bold text-success">
                {stats.good}
              </div>
              <p className="text-xs text-muted-foreground">Excelente</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-warning-foreground font-mono text-[10px] font-medium tracking-widest uppercase">
                REGULAR
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="font-heading text-warning-foreground text-2xl font-bold">
                {stats.regular}
              </div>
              <p className="text-xs text-muted-foreground">Atenção</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-mono text-[10px] font-medium tracking-widest text-destructive uppercase">
                RUIM
              </CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="font-heading text-2xl font-bold text-destructive">{stats.bad}</div>
              <p className="text-xs text-muted-foreground">Correção</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-mono text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
                N/A
              </CardTitle>
              <MinusCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-heading text-2xl font-bold text-muted-foreground">{stats.na}</div>
              <p className="text-xs text-muted-foreground">Não aplicável</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-mono text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-heading text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Itens</p>
            </CardContent>
          </Card>
        </div>

        {/* Checklist Items */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-xs font-bold tracking-widest uppercase">
              Itens do Checklist
            </CardTitle>
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
