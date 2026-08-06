import { DataTable } from "@/components/data-table";
import { MetaPagination } from "@/components/meta-pagination";
import { Loader } from "lucide-react";
import { DataTableSkeleton } from "@/components/skeletons/data-table";

import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
    <div className="flex flex-col gap-y-4 flex-1">
      <Card>
        <CardContent>
          <h2 className="text-2xl font-bold tracking-tight">Notificações</h2>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-4">
          <ChecklistNotificationsFilterForm />
          <div className="relative">
            {isLoading && !isFetching && (
              <DataTableSkeleton columns={checklistNotificationsColumns} />
            )}
            {isFetching && (
              <div className="absolute z-10 rounded-lg backdrop-blur-md inset-0 bg-black/10 flex items-center justify-center flex-col gap-y-2">
                <Loader className="animate-spin text-primary size-12" />
              </div>
            )}
            <DataTable columns={checklistNotificationsColumns} data={notifications} />
          </div>
        </CardContent>
        <CardFooter>
          <MetaPagination meta={data?.meta} />
        </CardFooter>
      </Card>
    </div>
  );
}
