import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStatusRange } from "../types";

const SEGMENT_STYLE: Record<string, { className: string }> = {
  BOM: { className: "bg-success" },
  REGULAR: { className: "bg-warning" },
  RUIM: { className: "bg-destructive" },
};

export function ScoreDistributionCard({
  data,
}: {
  data: DashboardStatusRange[];
}) {
  const segments = ["BOM", "REGULAR", "RUIM"]
    .map((label) => ({
      label,
      n: Number(data.find((r) => r.status === label)?.total ?? 0),
      className: SEGMENT_STYLE[label].className,
    }))
    .filter((s) => s.n > 0 || data.some((r) => r.status === s.label));
  const grandTotal = segments.reduce((sum, s) => sum + s.n, 0) || 1;

  return (
    <Card className="gap-[22px] p-[20px_22px]">
      <CardHeader className="p-0">
        <CardTitle className="font-heading text-xs font-bold tracking-widest uppercase">
          Distribuição de classificação
        </CardTitle>
        <p className="text-[11px] text-muted-foreground">
          Itens de checklist avaliados, ciclo atual
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-[18px] p-0">
        <div className="flex h-6.5 overflow-hidden rounded-md">
          {segments.map((s) => (
            <div
              key={s.label}
              className={s.className}
              style={{ width: `${(s.n / grandTotal) * 100}%` }}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2.5">
          {segments.map((s) => (
            <div key={s.label} className="flex items-center gap-2.5">
              <span className={`h-2.5 w-2.5 rounded-xs ${s.className}`} />
              <span className="font-heading text-[11px] font-semibold tracking-wide">
                {s.label}
              </span>
              <span className="ml-auto font-mono text-xs text-muted-foreground">
                {s.n}
              </span>
              <span className="w-11 text-right font-mono text-[11px] text-muted-foreground/70">
                {Math.round((s.n / grandTotal) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
