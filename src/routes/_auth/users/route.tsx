import { createFileRoute, Outlet } from "@tanstack/react-router";
import { requirePermission } from "@/features/auth";

export const Route = createFileRoute("/_auth/users")({
  beforeLoad: ({ context }) =>
    requirePermission(context.auth, "users:edit_configs"),
  component: RouteComponent,
  loader: () => ({
    crumb: "Usuários",
  }),
});

function RouteComponent() {
  return <Outlet />;
}
