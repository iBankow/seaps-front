import { api } from "@/lib/api";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_auth/checklists/$checklistId/items/$itemId"
)({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { checklistId, itemId } = params;

    const { data } = await api
      .get(`/api/v1/checklists/${checklistId}/items/${itemId}`)
      .catch(() => {
        throw redirect({
          to: "/checklists/$checklistId",
          params: { checklistId },
        });
      });

    return {
      crumb: data.item.name,
      checklistItem: data,
    };
  },
});

function RouteComponent() {
  return <Outlet />;
}
