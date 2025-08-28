import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

import { ArrowLeft } from "lucide-react";
import { PropertyForm } from "../-components/form";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/_auth/properties/create/")({
  component: RouteComponent,
  loader: () => {
    return {
      crumb: "Criar Imóvel",
    };
  },
});

function RouteComponent() {
  return (
    <div className="flex flex-col gap-y-4">
      <Card>
        <CardContent>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/properties">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Criar Novo Imóvel</h1>
          </div>
        </CardContent>
      </Card>
      <PropertyForm />
    </div>
  );
}
