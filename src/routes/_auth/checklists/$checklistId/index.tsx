import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/common/stat-card";
import { MetaField } from "@/components/common/meta-field";
import { useChecklist } from "@/contexts/checklist-context";
import { useMemo } from "react";
import {
  CheckCircle2,
  Edit,
  FileText,
  History,
  List,
} from "lucide-react";
import { getFirstAndLastName } from "@/lib/utils";
import { StatusBadge } from "@/features/checklists";
import { useChecklistsItems } from "@/features/checklist-items";
import { formatDateLong } from "@/lib/format";
import { Loading } from "@/components/common/loading";

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

  const scoreTone = (score: number) => {
    if (score >= 2.5) return "text-success";
    if (score >= 1.5) return "text-warning-foreground";
    return "text-destructive";
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-3.5">
      {/* Mostrar mensagem se o checklist estiver aprovado e quem aprovou */}
      {checklist.status === "APPROVED" && (
        <Card className="border-validated/35 bg-validated/10 ring-validated/20">
          <CardContent>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-validated" />
              <p className="text-[13px] text-foreground">
                Este checklist foi aprovado por{" "}
                <span className="font-heading font-semibold tracking-wide uppercase">
                  {getFirstAndLastName(checklist.validator?.name)}
                </span>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <StatCard
          title="Itens BOM"
          value={stats?.good_items ?? 0}
          hint="avaliações positivas"
          tone="success"
        />
        <StatCard
          title="Itens REGULAR"
          value={stats?.regular_items ?? 0}
          hint="necessitam atenção"
          tone="warning"
        />
        <StatCard
          title="Itens RUIM"
          value={stats?.bad_items ?? 0}
          hint="requerem correção"
          tone="destructive"
        />
        <StatCard
          title="Itens N/A"
          value={stats?.na_items ?? 0}
          hint="não aplicável"
          tone="muted"
        />
      </div>

      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2">
        {stats && stats.completed_items > 0 && (
          <Card className="gap-4 p-[20px_22px]">
            <CardHeader className="p-0">
              <CardTitle className="font-heading text-xs font-bold tracking-widest uppercase">
                Resumo da pontuação
              </CardTitle>
              <p className="text-[11px] text-muted-foreground">
                Média ponderada dos itens avaliados
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex items-baseline gap-2">
                <span
                  className={`font-heading text-[30px] leading-none font-bold ${scoreTone(stats.total_score)}`}
                >
                  {stats.total_score.toFixed(2)}
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  pontos
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="gap-4 p-[20px_22px]">
          <CardHeader className="p-0">
            <CardTitle className="font-heading text-xs font-bold tracking-widest uppercase">
              Preenchimento
            </CardTitle>
            <p className="text-[11px] text-muted-foreground">
              Progresso geral do checklist
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-[30px] leading-none font-bold">
                {Math.round(stats?.completion_percentage || 0)}%
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">
                {stats?.completed_items || 0}/{stats?.total_items || 0} itens
              </span>
            </div>
            <Progress
              value={stats?.completion_percentage || 0}
              tone="success"
              className="mt-2.5 h-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Property and Evaluation Details */}
      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2">
        {/* Property Information */}
        <Card className="gap-4 p-[20px_22px]">
          <CardHeader className="p-0">
            <CardTitle className="font-heading text-xs font-bold tracking-widest uppercase">
              Informações do imóvel
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 p-0">
            <MetaField label="Nome">
              <span className="font-heading text-[15px] font-bold tracking-wide uppercase">
                {checklist.property?.name}
              </span>
            </MetaField>
            <MetaField label="Endereço">
              <span className="text-muted-foreground">
                {checklist.property?.address}
              </span>
            </MetaField>
            <MetaField label="Responsável pelo imóvel">
              {checklist.property?.person?.name}
            </MetaField>
          </CardContent>
        </Card>

        {/* Evaluation Information */}
        <Card className="gap-4 p-[20px_22px]">
          <CardHeader className="p-0">
            <CardTitle className="font-heading text-xs font-bold tracking-widest uppercase">
              Detalhes da avaliação
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 p-0">
            <MetaField label="Avaliador">{checklist.user?.name}</MetaField>
            <MetaField label="Órgão">
              <span className="font-heading font-semibold tracking-wide uppercase">
                {checklist.organization?.name}
              </span>
            </MetaField>
            <MetaField label="Situação">
              <StatusBadge status={checklist.status} />
            </MetaField>
            <MetaField label="Data de criação">
              <span className="font-mono text-[12px] text-muted-foreground">
                {formatDateLong(checklist.created_at)}
              </span>
            </MetaField>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2.5">
        <Button asChild>
          <Link to="/checklists/$checklistId/items" params={{ checklistId }}>
            <List />
            Ver Itens
          </Link>
        </Button>

        {checklist.status === "OPEN" && (
          <Button variant="outline" asChild>
            <Link to="/checklists/$checklistId/edit" params={{ checklistId }}>
              <Edit />
              Editar
            </Link>
          </Button>
        )}

        <Button variant="outline" asChild>
          <Link to="/checklists/$checklistId/history" params={{ checklistId }}>
            <History />
            Histórico
          </Link>
        </Button>

        {checklist.status !== "OPEN" && (
          <Button variant="outline" asChild>
            <Link
              to="/checklists/$checklistId/notification"
              params={{ checklistId }}
            >
              <FileText />
              Notificação
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
