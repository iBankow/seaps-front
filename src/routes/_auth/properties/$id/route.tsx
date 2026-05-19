import { propertiesApi } from "#/features/properties/api/properties";
import { propertiesKeys } from "#/features/properties/api/query-keys";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/properties/$id")({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    const data = await context.queryClient.ensureQueryData({
      queryKey: propertiesKeys.details(params.id),
      queryFn: () => propertiesApi.details(params.id),
    });

    return { crumb: data?.name, data };
  },
});

function RouteComponent() {
  return <Outlet />;
}
