import { Card, CardContent } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import { CreateModelForm } from "../-components/form";
import { BackButton } from "@/components/back-button";

export const Route = createFileRoute("/_auth/models/create/")({
  component: RouteComponent,
  loader: () => ({
    crumb: "Criar Modelo",
  }),
});

function RouteComponent() {
  return (
    <div className="flex flex-col gap-y-4">
      <Card>
        <CardContent>
          <div className="flex items-center gap-2">
            <BackButton />
            <h1 className="text-2xl font-bold">Criar Modelo</h1>
          </div>
        </CardContent>
      </Card>
      <CreateModelForm />
    </div>
  );
}
