import { DataTable } from "@/components/common/data-table";
import { MetaPagination } from "@/components/common/meta-pagination";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTableSkeleton } from "@/components/common/skeletons/data-table";

import { Link } from "@tanstack/react-router";
import { columns } from "./columns";
import { useChecklistsList } from "../api/checklists";
import { PermissionGate } from "@/features/auth";
import { DataFilterForm } from "./filter-form";
import { Loading } from "@/components/common/loading";
import { HeaderActions } from "@/contexts/header-actions-context";

export function ChecklistList({ params }: { params: any }) {
  const { data, isLoading, isFetching } = useChecklistsList(params);

  const checklists = data?.data || [];

  return (
    <div className="flex flex-col gap-y-4 flex-1 p-4">
      <HeaderActions>
        <PermissionGate permissions="checklists:create">
          <Button asChild>
            <Link to="/checklists/create">
              <Plus />
              Criar Checklist
            </Link>
          </Button>
        </PermissionGate>
      </HeaderActions>

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
