import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { DataTableSkeleton } from "@/components/skeletons/data-table";

import { createFileRoute, Link } from "@tanstack/react-router";
import { api } from "@/lib/api";
import { columns } from "./-components/columns";
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
    <div className="flex flex-col gap-y-4 flex-1 p-4">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Modelos</h2>
          <p className="mt-1 text-muted-foreground">
            Gerencie seus modelos aqui.
          </p>
        </div>
        <div className="self-end">
          <Button asChild>
            <Link to="/models/create">
              <Plus />
              Criar Modelo
            </Link>
          </Button>
        </div>
      </div>
      {loading ? (
        <DataTableSkeleton columns={columns} />
      ) : (
        <DataTable columns={columns} data={data?.data} />
      )}
    </div>
  );
}
