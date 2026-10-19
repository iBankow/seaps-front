import { DataTable } from "@/components/common/data-table";
import { DataTableSkeleton } from "@/components/common/skeletons/data-table";
import { MetaPagination } from "@/components/common/meta-pagination";
import { useUsersList } from "../api/users";
import type { UsersListParams } from "../types";
import { columns } from "./columns";
import { DataFilterForm } from "./filter-form";

interface UsersTabProps {
  search: UsersListParams;
}

export function UsersTab({ search }: UsersTabProps) {
  const { data, isLoading } = useUsersList(search);

  return (
    <div className="mt-2 flex flex-col gap-y-6">
      <DataFilterForm />
      <div className="rounded-lg border">
        {isLoading ? (
          <DataTableSkeleton columns={columns} />
        ) : (
          <DataTable columns={columns} data={data?.data ?? []} />
        )}
      </div>
      <MetaPagination meta={data?.meta} label="usuário(s)" />
    </div>
  );
}
