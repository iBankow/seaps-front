import { createFileRoute } from "@tanstack/react-router";
import { BarComponent } from "./-components/bar-card";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { NumberCard } from "./-components/cards/numbers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChecklistsCard } from "./-components/checklist-card";
import { Building, CheckCircle, ListCheck } from "lucide-react";
import { IRMBarComponent } from "./-components/irm-chart";

export const Route = createFileRoute("/_auth/")({
  component: App,
  loader: () => {
    return {
      crumb: "Dashboard",
    };
  },
});

function App() {
  const [ranges, setRanges] = useState<any[]>([]);
  const [properties, setProperties] = useState<any>({});
  const [inspected, setInspected] = useState<any>({});
  const [checklists, setChecklists] = useState<any>({});
  const [igm, setIGM] = useState<any>([]);

  useEffect(() => {
    api.get("api/v1/dashboards").then(({ data }) => {
      setRanges(data.ranges);
      setProperties(data.properties);
      setInspected(data.inspected);
      setChecklists(data.checklists);
      setIGM(data.igm);
    });
  }, []);

  return (
    <div className="text-center space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <NumberCard
          title="Imóveis Cadastrados"
          number={properties?.total}
          icon={Building}
          className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-foreground"
        />
        <NumberCard
          title="Imóveis Vistoriados"
          number={inspected?.total}
          icon={CheckCircle}
          className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-foreground"
        />
        <NumberCard
          title="Checklists Realizados"
          number={checklists?.total}
          icon={ListCheck}
          className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-foreground"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <BarComponent data={ranges} />
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
            <IRMBarComponent data={igm} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
