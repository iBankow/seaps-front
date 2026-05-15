import { CreateOrderWizard } from "#/features/checklists/ui/create-components/create-checklist-wizard";
import { createFileRoute } from "@tanstack/react-router";

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
    <div className="sm:px-8">
      <CreateOrderWizard />
    </div>
  );
}
