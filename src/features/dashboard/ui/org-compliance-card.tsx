import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getIgmiInfo } from "./igmi-status";
import type { DashboardOrganizationIRM } from "../types";

// Ordem de exibição: melhor classificação do IGMI primeiro.
const IGMI_CATEGORIES = [2, 1, 0] as const;

export function OrgComplianceCard({
  data,
}: {
  data: DashboardOrganizationIRM[];
}) {
  const withPct = data.map((org) => {
    const total = org.qtd_bom + org.qtd_regular + org.qtd_ruim;
    const pct = total > 0 ? Math.round((org.qtd_bom / total) * 100) : 0;
    return { ...org, pct, total };
  });

  const groups = IGMI_CATEGORIES.map((classificacao) => ({
    classificacao,
    info: getIgmiInfo(classificacao),
    orgs: withPct
      .filter((org) => org.classificacao_igmi === classificacao)
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 2),
  })).filter((group) => group.orgs.length > 0);

  return (
    <Card className="gap-4 p-[20px_22px]">
      <CardHeader className="p-0">
        <CardTitle className="font-heading text-xs font-bold tracking-widest uppercase">
          Conformidade por órgão
        </CardTitle>
        <p className="text-[11px] text-muted-foreground">
          2 melhores órgãos por categoria do indicador geral de manutenção
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-0">
        {groups.length === 0 && (
          <p className="text-sm text-muted-foreground">Sem dados suficientes.</p>
        )}
        {groups.map((group) => (
          <div key={group.classificacao} className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: group.info.color }}
              />
              <span className="font-mono text-[9.5px] tracking-[0.12em] text-muted-foreground uppercase">
                {group.info.label}
              </span>
            </div>
            {group.orgs.map((org) => (
              <div
                key={org.organization_id}
                className="flex items-center gap-3"
              >
                <div className="w-19 shrink-0 truncate font-heading text-[11px] font-semibold tracking-wide">
                  {org.name}
                </div>
                <div className="h-3.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${org.pct}%`,
                      backgroundColor: group.info.color,
                    }}
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
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
