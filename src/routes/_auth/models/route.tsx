import { createFileRoute, Outlet } from "@tanstack/react-router";
import { requirePermission } from "@/features/auth";

export const Route = createFileRoute("/_auth/models")({
  beforeLoad: ({ context }) => requirePermission(context.auth, "system:admin"),
  component: RouteComponent,
  loader: () => ({
    crumb: "Modelos",
  }),
});

function RouteComponent() {
  return <Outlet />;
}
