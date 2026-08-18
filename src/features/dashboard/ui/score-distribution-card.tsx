"use client";

import { Cell, Pie, PieChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { DashboardStatusRange } from "../types";

const SEGMENT_META: Record<
  string,
  { label: string; className: string }
> = {
  BOM: { label: "Bom", className: "bg-success" },
  REGULAR: { label: "Regular", className: "bg-warning" },
  RUIM: { label: "Ruim", className: "bg-destructive" },
};

const chartConfig = {
  BOM: { label: "Bom", color: "var(--success)" },
  REGULAR: { label: "Regular", color: "var(--warning)" },
  RUIM: { label: "Ruim", color: "var(--destructive)" },
} satisfies ChartConfig;

export function ScoreDistributionCard({
  data,
}: {
  data: DashboardStatusRange[];
}) {
  const segments = ["BOM", "REGULAR", "RUIM"]
    .map((status) => ({
      status,
      label: SEGMENT_META[status].label,
      className: SEGMENT_META[status].className,
      value: Number(data.find((r) => r.status === status)?.total ?? 0),
      fill: `var(--color-${status})`,
    }))
    .filter((s) => s.value > 0);
  const grandTotal = segments.reduce((sum, s) => sum + s.value, 0) || 1;

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
        {segments.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Sem dados suficientes.
          </p>
        ) : (
          <>
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[210px] w-full"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      hideLabel
                      formatter={(value, _name, item) => (
                        <>
                          <span
                            className="h-2.5 w-2.5 shrink-0 rounded-xs"
                            style={{ backgroundColor: item.payload.fill }}
                          />
                          {item.payload.label}
                          <span className="ml-auto font-mono font-medium tabular-nums text-foreground">
                            {value} (
                            {Math.round((Number(value) / grandTotal) * 100)}%)
                          </span>
                        </>
                      )}
                    />
                  }
                />
                <Pie
                  data={segments}
                  dataKey="value"
                  nameKey="label"
                  strokeWidth={3}
                  stroke="var(--card)"
                >
                  {segments.map((s) => (
                    <Cell key={s.status} fill={s.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="flex flex-col gap-2.5">
              {segments.map((s) => (
                <div key={s.status} className="flex items-center gap-2.5">
                  <span
                    className={`h-2.5 w-2.5 rounded-xs ${s.className}`}
                  />
                  <span className="font-heading text-[11px] font-semibold tracking-wide">
                    {s.label}
                  </span>
                  <span className="ml-auto font-mono text-xs text-muted-foreground">
                    {s.value}
                  </span>
                  <span className="w-11 text-right font-mono text-[11px] text-muted-foreground/70">
                    {Math.round((s.value / grandTotal) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
