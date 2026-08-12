import { Building, CheckCircle, ListCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboard } from "../api/dashboard";
import { BarComponent } from "../ui/bar-card";
import { NumberCard } from "../ui/numbers-card";
import { IRMBarComponent } from "../ui/irm-chart";
import { ChecklistsCard } from "../ui/checklists-card";

export function DashboardPage() {
  const { data } = useDashboard();

  return (
    <div className="text-center space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <NumberCard
          title="Imóveis Cadastrados"
          number={data?.properties?.total}
          icon={Building}
          className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-foreground"
        />
        <NumberCard
          title="Imóveis Vistoriados"
          number={data?.inspected?.total}
          icon={CheckCircle}
          className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-foreground"
        />
        <NumberCard
          title="Checklists Realizados"
          number={data?.checklists?.total}
          icon={ListCheck}
          className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-foreground"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <BarComponent data={data?.ranges ?? []} />
        <Card className="col-span-1 sm:col-span-2">
          <CardHeader>
            <CardTitle>Últimos Checklists Fechados</CardTitle>
          </CardHeader>
          <CardContent>
            <ChecklistsCard />
          </CardContent>
        </Card>
        <Card className="col-span-1 sm:col-span-3">
          <CardContent>
            <IRMBarComponent data={data?.igm ?? []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
