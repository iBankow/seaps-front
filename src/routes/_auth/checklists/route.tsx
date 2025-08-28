import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/checklists")({
  component: RouteComponent,
  loader: () => ({
    crumb: "Checklists",
  }),
});

function RouteComponent() {
  return <Outlet />;
}
