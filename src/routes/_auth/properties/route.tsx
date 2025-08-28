import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/properties")({
  component: RouteComponent,
  loader: () => {
    return {
      crumb: "Imóveis",
    };
  },
});

function RouteComponent() {
  return <Outlet />;
}
