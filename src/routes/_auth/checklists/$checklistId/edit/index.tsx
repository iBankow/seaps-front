import { createFileRoute } from "@tanstack/react-router";
import { useChecklist } from "@/contexts/checklist-context";
import { EditCheckListForm } from "@/features/checklists";

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
    <div className="flex flex-col items-center gap-y-4 w-full">
      <EditCheckListForm checklist={checklist} />
    </div>
  );
}
