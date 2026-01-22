"use client";

import { Pie, PieChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  total: {
    label: "Total",
    color: "var(--chart-1)",
  },
  BOM: {
    label: "BOM",
    color: "var(--chart-2)",
  },
  REGULAR: {
    label: "REGULAR",
    color: "var(--chart-3)",
  },
  RUIM: {
    label: "RUIM",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

type Data = { status: string; total: number };

export function BarComponent({ data }: { data: Data[] }) {
  const _data = data.map((value) => {
    return {
      ...value,
      total: Number(value.total),
      fill: chartConfig[value.status as keyof typeof chartConfig]?.color,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total de checklist por Status</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="status" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
            <Pie
              data={_data}
              dataKey="total"
              nameKey="status"
              stroke="0"
              label={({ status, total, percent }) =>
                `${status}: ${total} (${(percent * 100).toFixed(1)}%)`
              }
              labelLine={true}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
