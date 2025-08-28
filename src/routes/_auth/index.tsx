import { createFileRoute } from "@tanstack/react-router";
import { BarComponent } from "./-components/bar-card";
import { IRMBarComponent } from "./-components/irm-chart";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export const Route = createFileRoute("/_auth/")({
  component: App,
});

function App() {
  const [bar, setBar] = useState<any[]>([]);
  const [irm, setIrm] = useState<any[]>([]);

  useEffect(() => {
    api.get("api/v1/dashboard").then(({ data }) => {
      setIrm(data.irm);
      setBar(data.ranges);
    });
  }, []);

  return (
    <div className="text-center">
      <div className="grid grid-cols-1 sm:grid-cols-3">
        <BarComponent data={bar} />
        <IRMBarComponent data={irm} />
      </div>
    </div>
  );
}
