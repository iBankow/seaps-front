import { createFileRoute } from "@tanstack/react-router";
import { BarComponent } from "./-components/bar-card";
import { IRMBarComponent } from "./-components/irm-chart";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { RadialComponent } from "./-components/radial-card";

export const Route = createFileRoute("/_auth/")({
  component: App,
});

function App() {
  const [bar, setBar] = useState<any[]>([]);
  const [irm, setIrm] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    api.get("api/v1/dashboard").then(({ data }) => {
      setIrm(data.irm);
      setBar(data.ranges);
      setProperties(data.properties);
    });
  }, []);

  return (
    <div className="text-center">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <BarComponent data={bar} />
        <RadialComponent data={properties} />
        <IRMBarComponent data={irm} />
      </div>
    </div>
  );
}
