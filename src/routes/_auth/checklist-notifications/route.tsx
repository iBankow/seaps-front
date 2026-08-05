import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/checklist-notifications")({
  component: RouteComponent,
  loader: () => ({
    crumb: "Notificações",
  }),
});

function RouteComponent() {
  return <Outlet />;
}
