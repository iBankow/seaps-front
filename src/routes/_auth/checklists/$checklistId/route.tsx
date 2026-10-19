import { ChecklistProvider } from "@/contexts/checklist-context";
import { createFileRoute, Outlet, useParams } from "@tanstack/react-router";
import { ChecklistHeader } from "@/features/checklists";

export const Route = createFileRoute("/_auth/checklists/$checklistId")({
  component: RouteComponent,
  loader: () => ({ crumb: "Detalhes" }),
});

export function RouteComponent() {
  const { checklistId } = useParams({
    from: "/_auth/checklists/$checklistId",
  });

  return (
    <ChecklistProvider checklistId={checklistId}>
      <div>
        <ChecklistHeader />
        <Outlet />
      </div>
    </ChecklistProvider>
  );
}
