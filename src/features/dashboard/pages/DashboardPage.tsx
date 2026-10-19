import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { useDashboard } from "../api/dashboard";
import { StatCard } from "@/components/common/stat-card";
import { IRMBarComponent } from "../ui/irm-chart";
import { ChecklistsCard } from "../ui/checklists-card";
import { OrgComplianceCard } from "../ui/org-compliance-card";
import { OrgIgmiTable } from "../ui/org-igmi-table";
import { ScoreDistributionCard } from "../ui/score-distribution-card";

export function DashboardPage() {
  const { data } = useDashboard();

  const itensCriticos = data?.ranges?.find((r) => r.status === "RUIM")?.total;

  return (
    <div className="flex flex-col gap-3.5">
      <PageHeader eyebrow="Visão geral" title="Dashboard" />

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Imóveis cadastrados"
          value={data?.properties?.total}
          tone="primary"
        />
        <StatCard
          title="Imóveis vistoriados"
          value={data?.inspected?.total}
          hint="no ciclo atual"
          tone="success"
        />
        <StatCard
          title="Checklists realizados"
          value={data?.checklists?.total}
          tone="primary"
        />
        <StatCard
          title="Itens críticos"
          value={itensCriticos}
          hint="classificados RUIM"
          tone="destructive"
        />
      </div>

      <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-[1.15fr_.85fr]">
        <OrgComplianceCard data={data?.igm ?? []} />
        <ScoreDistributionCard data={data?.ranges ?? []} />
      </div>

      <Card className="gap-0 overflow-hidden p-0">
        <CardHeader className="flex-row items-center gap-2 border-b p-[18px_22px]">
          <CardTitle className="font-heading text-xs font-bold tracking-widest uppercase">
            Checklists recentes
          </CardTitle>
          <Link
            to="/checklists"
            className="ml-auto border-b-[1.5px] border-success pb-0.5 font-heading text-[10px] font-semibold tracking-widest text-primary uppercase hover:text-primary/80"
          >
            ver todos
          </Link>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <ChecklistsCard />
        </CardContent>
      </Card>

      <IRMBarComponent data={data?.igm ?? []} />

      <OrgIgmiTable data={data?.igm ?? []} />
    </div>
  );
}
