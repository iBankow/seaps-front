import { DataTable } from "@/components/common/data-table";
import { MetaPagination } from "@/components/common/meta-pagination";
import { DataTableSkeleton } from "@/components/common/skeletons/data-table";
import { Loading } from "@/components/common/loading";

import { createFileRoute } from "@tanstack/react-router";
import {
  ChecklistNotificationsFilterForm,
  checklistNotificationsColumns,
  useChecklistNotificationsList,
} from "@/features/checklist-notifications";
import z from "zod";

const SearchSchema = z.object({
  page: z.number().default(1),
  per_page: z.number().default(10),
  organization_id: z.string().optional(),
  property_name: z.string().optional(),
  city: z.string().optional(),
});

export const Route = createFileRoute("/_auth/checklist-notifications/")({
  component: RouteComponent,
  validateSearch: SearchSchema,
});

export function RouteComponent() {
  const search = Route.useSearch();

  const { data, isLoading, isFetching } = useChecklistNotificationsList(search);

  const notifications = data?.data || [];

  return (
    <div className="flex flex-col gap-y-4 flex-1 p-4">
      <ChecklistNotificationsFilterForm />
      <div className="relative">
        {isLoading && !isFetching && (
          <DataTableSkeleton columns={checklistNotificationsColumns} />
        )}
        {isFetching && (
          <div className="absolute z-10 rounded-lg backdrop-blur-md inset-0 bg-black/10 flex items-center justify-center flex-col gap-y-2">
            <Loading size="sm" />
          </div>
        )}
        <DataTable columns={checklistNotificationsColumns} data={notifications} />
      </div>
      <MetaPagination meta={data?.meta} />
    </div>
  );
}
