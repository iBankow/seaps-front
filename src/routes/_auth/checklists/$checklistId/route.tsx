import { ChecklistProvider } from "@/contexts/checklist-context";
import { createFileRoute, Outlet, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/checklists/$checklistId")({
  component: RouteComponent,
  loader: () => {
    return {
      crumb: "Checklist",
    };
  },
});

export function RouteComponent() {
  const { checklistId } = useParams({
    from: "/_auth/checklists/$checklistId",
  });

  return (
    <ChecklistProvider checklistId={checklistId}>
      <Outlet />
    </ChecklistProvider>
  );
}
