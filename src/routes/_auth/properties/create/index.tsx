import { CreatePropertyWizard } from "#/features/properties/ui/create-components/create-property-wizard";
import { createFileRoute } from "@tanstack/react-router";

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
    <div className="sm:px-8">
      <CreatePropertyWizard />
    </div>
  );
}
