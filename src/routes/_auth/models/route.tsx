import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/models")({
  component: RouteComponent,
  loader: () => ({
    crumb: "Modelos",
  }),
});

function RouteComponent() {
  return <Outlet />;
}
