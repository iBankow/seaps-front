import { NotFound } from "#/components/not-found";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/properties")({
  component: RouteComponent,
  loader: () => {
    return {
      crumb: "Imóveis",
    };
  },
  notFoundComponent: NotFound,
});

function RouteComponent() {
  return <Outlet />;
}
