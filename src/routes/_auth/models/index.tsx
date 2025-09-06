import { DataTable } from "@/components/data-table";
import { MetaPagination } from "@/components/meta-pagination";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { DataTableSkeleton } from "@/components/skeletons/data-table";

import { createFileRoute } from "@tanstack/react-router";
import { api } from "@/lib/api";
import { columns } from "./-components/columns";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>();

  useEffect(() => {
    api
      .get("/api/v1/models", {
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
              <Button disabled>
                <Plus />
                Criar Modelo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-4">
          {/* <DataFilterForm /> */}
          {loading ? (
            <DataTableSkeleton columns={columns} />
          ) : (
            <DataTable columns={columns} data={data?.data} />
          )}
        </CardContent>
        <CardFooter>
          <MetaPagination meta={data?.meta} />
        </CardFooter>
      </Card>
    </div>
  );
}
