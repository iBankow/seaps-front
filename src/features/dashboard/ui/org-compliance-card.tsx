import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DashboardOrganizationIRM } from "../types";

function complianceColor(pct: number) {
  if (pct >= 75) return "bg-success";
  if (pct >= 60) return "bg-warning";
  return "bg-destructive";
}

export function OrgComplianceCard({
  data,
}: {
  data: DashboardOrganizationIRM[];
}) {
  const bars = data
    .map((org) => {
      const total = org.qtd_bom + org.qtd_regular + org.qtd_ruim;
      const pct = total > 0 ? Math.round((org.qtd_bom / total) * 100) : 0;
      return { ...org, pct, total };
    })
    .sort((a, b) => b.pct - a.pct);

  return (
    <Card className="gap-4 p-[20px_22px]">
      <CardHeader className="p-0">
        <CardTitle className="font-heading text-xs font-bold tracking-widest uppercase">
          Conformidade por órgão
        </CardTitle>
        <p className="text-[11px] text-muted-foreground">
          % de imóveis classificados como BOM por órgão
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 p-0">
        {bars.length === 0 && (
          <p className="text-sm text-muted-foreground">Sem dados suficientes.</p>
        )}
        {bars.map((org) => (
          <div key={org.organization_id} className="flex items-center gap-3">
            <div className="w-19 shrink-0 truncate font-heading text-[11px] font-semibold tracking-wide">
              {org.name}
            </div>
            <div className="h-3.5 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full rounded-full", complianceColor(org.pct))}
                style={{ width: `${org.pct}%` }}
              />
            </div>
            <div className="w-13 shrink-0 text-right font-mono text-[11px] text-muted-foreground">
              {org.pct}%
            </div>
            <div className="w-24 shrink-0 text-right font-mono text-[10px] whitespace-nowrap text-muted-foreground/70">
              {org.total} imóveis
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
