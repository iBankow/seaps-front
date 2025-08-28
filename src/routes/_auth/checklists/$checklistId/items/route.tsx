import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/checklists/$checklistId/items")({
  component: RouteComponent,
  loader: ({}) => {
    return {
      crumb: "Items",
    };
  },
});

function RouteComponent() {
  return <Outlet />;
}
