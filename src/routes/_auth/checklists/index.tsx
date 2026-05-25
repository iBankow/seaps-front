import { DataTable } from "@/components/data-table";
import { MetaPagination } from "@/components/meta-pagination";
import { Button } from "@/components/ui/button";
import { Loader, Plus } from "lucide-react";
import { DataTableSkeleton } from "@/components/skeletons/data-table";

import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/contexts/auth-contexts";
import { columns } from "./-components/columns";
import { DataFilterForm } from "./-components/filter-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { can } from "@/lib/permissions";
import { useChecklistsList } from "@/features/checklists/api/checklists";
import { useIsMobile } from "@/hooks/use-mobile";
import z from "zod";
import { StatusBadge } from "@/components/status-badge";
import { cn } from "@/lib/utils";
import { Loading } from "@/components/loading";

const SearchSchema = z.object({
  page: z.number().default(1),
  per_page: z.number().default(10),
  organization_id: z.string().optional(),
  user_id: z.string().optional(),
  status: z.string().optional(),
  property_name: z.string().optional(),
  city: z.string().optional(),
});

export const Route = createFileRoute("/_auth/checklists/")({
  component: RouteComponent,
  validateSearch: SearchSchema,
});

export function RouteComponent() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const search = Route.useSearch();

  const { data, isLoading, isFetching } = useChecklistsList(search);

  const checklists = data?.data || [];

  if (isMobile) {
    return (
      <div className="flex-1 flex flex-col max-h-[calc(100vh-130px)]">
        <div className="flex items-center justify-between mb-4">
          <DataFilterForm data={data?.data} totalRecords={data?.meta.total} />
        </div>
        <div className="overflow-scroll pr-2 -mr-2">
          {isFetching && (
            <div className="absolute z-10 rounded-lg backdrop-blur-md inset-0 bg-black/10 flex items-center justify-center flex-col gap-y-2">
              <Loader className="animate-spin text-primary size-12" />
            </div>
          )}

          <div className="flex flex-col gap-2 p-px">
            {!isLoading &&
              checklists.map((checklist) => (
                <Link
                  to={`/checklists/$checklistId`}
                  params={{ checklistId: checklist.id }}
                  key={checklist.id}
                >
                  <Card
                    className={cn(
                      checklist.status === "CLOSED" && "ring-red-500/20",
                      checklist.status === "OPEN" && "ring-green-500/20",
                      checklist.status === "APPROVED" && "ring-purple-500/20",
                    )}
                  >
                    <CardHeader className="flex items-center justify-between">
                      <CardTitle className="text-xs">
                        {checklist.sid}{" "}
                        <span>{checklist.organization.acronym}</span>
                      </CardTitle>
                      <CardDescription>
                        <StatusBadge status={checklist.status} />
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-1 font-bold">
                        {checklist.property?.name}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-4 flex-1 p-4">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Checklists</h2>
          <p className="mt-1">Gerencie todos os checklists disponíveis.</p>
        </div>
        <div className="self-end">
          {can(["checklists:create"], user?.permissions) && (
            <Button asChild>
              <Link to="/checklists/create">
                <Plus />
                Criar Checklist
              </Link>
            </Button>
          )}
        </div>
      </div>

      <DataFilterForm data={data?.data} totalRecords={data?.meta.total} />
      <div className="relative">
        {isLoading && isFetching && <DataTableSkeleton columns={columns} />}
        {isFetching && (
          <div className="absolute z-10 rounded-lg backdrop-blur-md inset-0 bg-black/10 flex items-center justify-center flex-col gap-y-2">
            <Loading size="sm" />
          </div>
        )}
        {!isLoading && <DataTable columns={columns} data={checklists} />}
      </div>
      <MetaPagination meta={data?.meta} />
    </div>
  );
}
