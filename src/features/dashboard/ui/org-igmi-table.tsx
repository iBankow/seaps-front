import { Badge, type badgeVariants } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { VariantProps } from "class-variance-authority";
import type { DashboardOrganizationIRM } from "../types";
import { getIgmiInfo, type IgmiClassification } from "./igmi-status";

const CLASSIFICATION_BADGE_VARIANT: Record<
  IgmiClassification,
  VariantProps<typeof badgeVariants>["variant"]
> = {
  BOM: "success",
  REGULAR: "warning",
  RUIM: "destructive",
  "N/A": "outline",
};

export function OrgIgmiTable({ data }: { data: DashboardOrganizationIRM[] }) {
  const totals = data.reduce(
    (acc, org) => ({
      qtd_bom: acc.qtd_bom + org.qtd_bom,
      qtd_regular: acc.qtd_regular + org.qtd_regular,
      qtd_ruim: acc.qtd_ruim + org.qtd_ruim,
      total_imoveis: acc.total_imoveis + org.total_imoveis,
    }),
    { qtd_bom: 0, qtd_regular: 0, qtd_ruim: 0, total_imoveis: 0 },
  );

  return (
    <Card className="gap-0 overflow-hidden p-0">
      <CardHeader className="border-b p-[18px_22px]">
        <CardTitle className="font-heading text-xs font-bold tracking-widest uppercase">
          Indicador geral de manutenção por órgão
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Órgão</TableHead>
              <TableHead className="text-right">Bom</TableHead>
              <TableHead className="text-right">Regular</TableHead>
              <TableHead className="text-right">Ruim</TableHead>
              <TableHead className="text-right">Imóveis vistoriados</TableHead>
              <TableHead>Indicador geral de manutenção</TableHead>
              <TableHead>Classificação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((org) => {
              const info = getIgmiInfo(org.classificacao_igmi);
              return (
                <TableRow
                  key={org.organization_id}
                  className="hover:bg-secondary/60"
                >
                  <TableCell className="font-heading text-xs font-semibold tracking-wide">
                    {org.name}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-muted-foreground">
                    {org.qtd_bom}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-muted-foreground">
                    {org.qtd_regular}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-muted-foreground">
                    {org.qtd_ruim}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-muted-foreground">
                    {org.total_imoveis}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {info.label}
                  </TableCell>
                  <TableCell>
                    <Badge variant={CLASSIFICATION_BADGE_VARIANT[info.classification]}>
                      {info.classification}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
            {data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-sm text-muted-foreground"
                >
                  Sem dados suficientes.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {data.length > 0 && (
            <TableFooter>
              <TableRow>
                <TableCell className="font-heading text-xs font-bold tracking-widest uppercase">
                  Total
                </TableCell>
                <TableCell className="text-right font-mono text-xs font-semibold">
                  {totals.qtd_bom}
                </TableCell>
                <TableCell className="text-right font-mono text-xs font-semibold">
                  {totals.qtd_regular}
                </TableCell>
                <TableCell className="text-right font-mono text-xs font-semibold">
                  {totals.qtd_ruim}
                </TableCell>
                <TableCell className="text-right font-mono text-xs font-semibold">
                  {totals.total_imoveis}
                </TableCell>
                <TableCell colSpan={2} />
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </CardContent>
    </Card>
  );
}
