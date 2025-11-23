import { DataTable } from "@/components/data-table";
import { useEffect, useState } from "react";
import { DataTableSkeleton } from "@/components/skeletons/data-table";
import { api } from "@/lib/api";
import { columns } from "./columns";
import { DataFilterForm } from "./filter-form";
import { CardContent, CardFooter } from "@/components/ui/card";
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
    <>
      <CardContent className="space-y-6 pt-6">
        <DataFilterForm />
        <div className="rounded-lg border">
          {loading ? (
            <DataTableSkeleton columns={columns} />
          ) : (
            <DataTable columns={columns} data={data?.data} />
          )}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between mt-6 border-t pt-6">
        <MetaPagination meta={data?.meta} label="usuário(s)" />
      </CardFooter>
    </>
  );
}
