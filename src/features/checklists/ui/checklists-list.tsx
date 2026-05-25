import { DataTable } from "@/components/data-table";
import { MetaPagination } from "@/components/meta-pagination";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTableSkeleton } from "@/components/skeletons/data-table";

import { Link } from "@tanstack/react-router";
import { columns } from "./list-components/columns";
import { useChecklistsList } from "../api/checklists";
import { useAuth } from "@/contexts/auth-contexts";
import { can } from "@/lib/permissions";
import { DataFilterForm } from "./list-components/filter-form";
import { Loading } from "@/components/loading";

export function ChecklistList({ params }: { params: any }) {
  const { user } = useAuth();

  const { data, isLoading, isFetching } = useChecklistsList(params);

  const checklists = data?.data || [];

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

      <DataFilterForm data={data?.data} totalRecords={data?.meta?.total} />
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
