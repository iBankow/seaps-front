import { DataTable } from "@/components/data-table";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { DataTableSkeleton } from "@/components/skeletons/data-table";

import { createFileRoute, Link } from "@tanstack/react-router";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/auth-contexts";
import { columns } from "./-components/columns";
import { DataFilterForm } from "./-components/filter-form";
import z from "zod";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const SearchSchema = z.object({
  page: z.number().default(1),
  per_page: z.number().default(10),
  organization: z.string().optional(),
  user: z.string().optional(),
  status: z.string().optional(),
  property_name: z.string().optional(),
});

export const Route = createFileRoute("/_auth/checklists/")({
  component: RouteComponent,
  validateSearch: SearchSchema,
});

export function RouteComponent() {
  const { user } = useAuth();

  const search = Route.useSearch();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>();

  useEffect(() => {
    api
      .get("/api/v1/checklists", {
        params: { ...search },
      })
      .then(({ data }) => setData(data))
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <div className="flex flex-col gap-y-4 flex-1">
      <Card>
        <CardContent>
          <div className="flex justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Checklists</h2>
            </div>
            <div className="self-end">
              {user?.role !== "EVALUATOR" && (
                <Button asChild>
                  <Link to="/checklists/create">
                    <Plus />
                    Criar Checklist
                  </Link>
                </Button>
              )}
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
        <CardFooter className="w-full justify-center flex-col gap-4">
          {data?.meta?.total > 10 && <Pagination meta={data?.meta} />}
          {data?.meta && <p>Total de {data?.meta?.total} item(s)</p>}
        </CardFooter>
      </Card>
    </div>
  );
}
