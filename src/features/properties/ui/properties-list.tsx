import { DataTable } from "@/components/data-table";
import { MetaPagination } from "@/components/meta-pagination";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTableSkeleton } from "@/components/skeletons/data-table";

import { Link } from "@tanstack/react-router";
import { usePropertiesList } from "../api/properties";
import { columns } from "./list-components/columns";
import { DataFilterForm } from "./list-components/filter-form";
import { can } from "@/lib/permissions";
import { useAuth } from "@/contexts/auth-contexts";
import { Loading } from "@/components/loading";

export function PropertiesList({ params }: { params: any }) {
  const { user } = useAuth();

  const { data, isLoading, isFetching } = usePropertiesList(params);

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
        {!isLoading && (
          <DataTable
            columns={columns}
            data={properties}
            className="table-fixed"
          />
        )}
      </div>
      <MetaPagination meta={data?.meta} />
    </div>
  );
}
