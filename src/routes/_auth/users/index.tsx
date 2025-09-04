import { DataTable } from "@/components/data-table";
import { Pagination } from "@/components/pagination";
import { useEffect, useState } from "react";
import { DataTableSkeleton } from "@/components/skeletons/data-table";

import { createFileRoute } from "@tanstack/react-router";
import { api } from "@/lib/api";
import { columns } from "./-components/columns";
import { DataFilterForm } from "./-components/filter-form";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/_auth/users/")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): any => {
    return {
      page: search.page || 1,
      per_page: search.per_page || 10,
      organization: search.organization,
      role: search.role,
      name: search.name,
      email: search.email,
    };
  },
});

export function RouteComponent() {
  const search = Route.useSearch();

  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/v1/users", {
        params: { ...search },
      })
      .then(({ data }) => setData(data))
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <div className="flex flex-col gap-y-4">
      <Card>
        <CardContent>
          <div className="flex justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Usuários</h2>
            </div>
            <div className="self-end">
              <Button disabled className="opacity-0!">
                <Plus />
                Criar Usuario
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-4">
          <DataFilterForm />
          {loading ? (
            <DataTableSkeleton columns={columns} />
          ) : (
            <DataTable columns={columns} data={data?.data} />
          )}
        </CardContent>
        <CardFooter className="w-full grid grid-cols-3 gap-4">
          {data?.meta?.total > 10 && (
            <Pagination className="col-start-2" meta={data?.meta} />
          )}
          {data?.meta && (
            <p className="justify-self-end">
              Total de {data?.meta?.total} item(s)
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
