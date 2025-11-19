import { Card, CardContent } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import { CreateCheckListForm } from "../../-components/create-form";
import { useChecklist } from "@/contexts/checklist-context";
import { BackButton } from "@/components/back-button";

export const Route = createFileRoute("/_auth/checklists/$checklistId/edit/")({
  component: RouteComponent,
  loader: () => {
    return {
      crumb: "Editar Checklist",
    };
  },
});

function RouteComponent() {
  const { checklist } = useChecklist();

  return (
    <div className="flex flex-col gap-y-4">
      <Card>
        <CardContent>
          <div className="flex items-center gap-2">
            <BackButton />
            <h1 className="text-2xl font-bold">Criar Checklist</h1>
          </div>
        </CardContent>
      </Card>
      <CreateCheckListForm checklist={checklist} />
    </div>
  );
}
