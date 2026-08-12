import { DataTable } from "@/components/common/data-table";
import { DataTableSkeleton } from "@/components/common/skeletons/data-table";
import { CardContent, CardFooter } from "@/components/ui/card";
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
    <>
      <CardContent className="space-y-6 pt-6">
        <DataFilterForm />
        <div className="rounded-lg border">
          {isLoading ? (
            <DataTableSkeleton columns={columns} />
          ) : (
            <DataTable columns={columns} data={data?.data ?? []} />
          )}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between mt-6 border-t pt-6">
        <MetaPagination meta={data?.meta} label="usuário(s)" />
      </CardFooter>
    </>
  );
}
