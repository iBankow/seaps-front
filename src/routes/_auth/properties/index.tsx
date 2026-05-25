import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTableSkeleton } from "@/components/skeletons/data-table";

import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/contexts/auth-contexts";
import { columns } from "./-components/columns";
import { DataFilterForm } from "./-components/filter-form";
import { MetaPagination } from "@/components/meta-pagination";
import { can } from "@/lib/permissions";
import { usePropertiesList } from "@/features/properties/api/properties";
import z from "zod";
import { Loading } from "@/components/loading";

const SearchSchema = z.object({
  page: z.number().default(1),
  per_page: z.number().default(10),
  organization_id: z.string().optional(),
  type: z.enum(["OWN", "RENTED", "GRANT"]).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  name: z.string().optional(),
});

export const Route = createFileRoute("/_auth/properties/")({
  component: RouteComponent,
  validateSearch: SearchSchema,
});

export function RouteComponent() {
  const { user } = useAuth();

  const search = Route.useSearch();

  const { data, isLoading, isFetching } = usePropertiesList(search);

  const properties = data?.data || [];

  return (
    <div className="flex flex-col gap-y-4 flex-1 p-4">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight inline-flex items-center gap-2">
            Imóveis
          </h2>
          <p className="mt-1">Gerencie todos os imóveis disponíveis.</p>
        </div>
        <div className="self-end">
          {can(["properties:create"], user?.permissions) && (
            <Button asChild>
              <Link to="/properties/create">
                <Plus />
                Criar Imóvel
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
        {!isLoading && <DataTable columns={columns} data={properties} />}
      </div>
      <MetaPagination meta={data?.meta} />
    </div>
  );
}
