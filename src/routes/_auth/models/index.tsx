import { DataTable } from "@/components/common/data-table";
import { MetaPagination } from "@/components/common/meta-pagination";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTableSkeleton } from "@/components/common/skeletons/data-table";

import { createFileRoute, Link } from "@tanstack/react-router";
import { modelsColumns, useModelsList } from "@/features/models";
import { HeaderActions } from "@/contexts/header-actions-context";
import z from "zod";

const SearchSchema = z.object({
  page: z.number().default(1),
  per_page: z.number().default(10),
});

export const Route = createFileRoute("/_auth/models/")({
  component: RouteComponent,
  validateSearch: SearchSchema,
});

function RouteComponent() {
  const search = Route.useSearch();

  const { data, isLoading } = useModelsList(search);

  return (
    <div className="flex flex-col gap-y-4 flex-1 p-4">
      <HeaderActions>
        <Button asChild>
          <Link to="/models/create">
            <Plus />
            Criar Modelo
          </Link>
        </Button>
      </HeaderActions>
      {isLoading ? (
        <DataTableSkeleton columns={modelsColumns} />
      ) : (
        <DataTable columns={modelsColumns} data={data?.data ?? []} />
      )}
      <MetaPagination meta={data?.meta} />
    </div>
  );
}
