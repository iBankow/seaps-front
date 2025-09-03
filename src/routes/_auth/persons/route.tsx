import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/persons")({
  component: RouteComponent,
  loader: () => {
    return {
      crumb: "Responsáveis",
    };
  },
});

function RouteComponent() {
  return <Outlet />;
}
