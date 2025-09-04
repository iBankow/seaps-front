import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/users")({
  component: RouteComponent,
  loader: () => ({
    crumb: "Usuários",
  }),
});

function RouteComponent() {
  return <Outlet />;
}
