import { http as api } from "@/lib/http";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/properties/$propertyId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { data } = await api
      .get(`/properties/${params.propertyId}`)
      .catch(() => {
        throw redirect({
          to: "..",
        });
      });

    return { crumb: data?.name, data };
  },
});

function RouteComponent() {
  return <Outlet />;
}
