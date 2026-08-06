import { DataTable } from "@/components/data-table";
import { MetaPagination } from "@/components/meta-pagination";
import { Button } from "@/components/ui/button";
import { Loader, Plus } from "lucide-react";
import { DataTableSkeleton } from "@/components/skeletons/data-table";

import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/features/auth";
import { columns } from "./-components/columns";
import { DataFilterForm } from "./-components/filter-form";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { can } from "@/features/auth";
import { useChecklistsList } from "@/features/checklists/api/checklists";
import z from "zod";

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

  const search = Route.useSearch();

  const { data, isLoading, isFetching } = useChecklistsList(search);

  const checklists = data?.data || [];

  return (
    <div className="flex flex-col gap-y-4 flex-1">
      <Card>
        <CardContent>
          <div className="flex justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Checklists</h2>
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
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-4">
          <DataFilterForm data={data?.data} totalRecords={data?.meta.total} />
          <div className="relative">
            {isLoading && !isFetching && (
              <DataTableSkeleton columns={columns} />
            )}
            {isFetching && (
              <div className="absolute z-10 rounded-lg backdrop-blur-md inset-0 bg-black/10 flex items-center justify-center flex-col gap-y-2">
                <Loader className="animate-spin text-primary size-12" />
              </div>
            )}
            <DataTable columns={columns} data={checklists} />
          </div>
        </CardContent>
        <CardFooter>
          <MetaPagination meta={data?.meta} />
        </CardFooter>
      </Card>
    </div>
  );
}
