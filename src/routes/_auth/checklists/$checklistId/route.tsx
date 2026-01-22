import { ChecklistProvider } from "@/contexts/checklist-context";
import { api } from "@/lib/api";
import {
  createFileRoute,
  Outlet,
  redirect,
  useLoaderData,
  useParams,
} from "@tanstack/react-router";
import { ChecklistHeader } from "../-components/header";

export const Route = createFileRoute("/_auth/checklists/$checklistId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { checklistId } = params;

    const { data } = await api
      .get(`/api/v1/checklists/${checklistId}`)
      .catch(() => {
        throw redirect({
          to: "/checklists",
        });
      });

    return {
      crumb: data.property.name,
      checklist: data,
    };
  },
});

export function RouteComponent() {
  const { checklistId } = useParams({
    from: "/_auth/checklists/$checklistId",
  });

  const { checklist } = useLoaderData({
    from: "/_auth/checklists/$checklistId",
  });

  return (
    <ChecklistProvider checklistId={checklistId} checklist={checklist}>
      <ChecklistHeader />
      <Outlet />
    </ChecklistProvider>
  );
}
