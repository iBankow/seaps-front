import { createFileRoute, Link } from "@tanstack/react-router";
import { CreateCheckListForm } from "../-components/create-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_auth/checklists/create/")({
  component: RouteComponent,
  loader: () => {
    return {
      crumb: "Criar Checklist",
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
            <h1 className="text-2xl font-bold">Criar Checklist</h1>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <CreateCheckListForm />
        </CardContent>
      </Card>
    </div>
  );
}
