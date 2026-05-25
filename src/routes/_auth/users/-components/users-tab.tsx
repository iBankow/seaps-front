import { DataTable } from "@/components/data-table";
import { useEffect, useState } from "react";
import { DataTableSkeleton } from "@/components/skeletons/data-table";
import { api } from "@/lib/api";
import { columns } from "./columns";
import { DataFilterForm } from "./filter-form";
import { MetaPagination } from "@/components/meta-pagination";

interface UsersTabProps {
  search: {
    page?: number;
    per_page?: number;
    organization?: string;
    role?: string;
    name?: string;
    email?: string;
  };
}

export function UsersTab({ search }: UsersTabProps) {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/api/v1/users", {
        params: { ...search },
      })
      .then(({ data }) => setData(data))
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <div className="mt-2 flex flex-col gap-y-6">
      <DataFilterForm />
      <div className="rounded-lg border">
        {loading ? (
          <DataTableSkeleton columns={columns} />
        ) : (
          <DataTable columns={columns} data={data?.data} />
        )}
      </div>
      <MetaPagination meta={data?.meta} label="usuário(s)" />
    </div>
  );
}
