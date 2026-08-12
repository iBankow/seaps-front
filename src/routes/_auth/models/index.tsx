import { DataTable } from "@/components/common/data-table";
import { MetaPagination } from "@/components/common/meta-pagination";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTableSkeleton } from "@/components/common/skeletons/data-table";

import { createFileRoute, Link } from "@tanstack/react-router";
import { modelsColumns, useModelsList } from "@/features/models";
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

  const { data, isLoading } = useModelsList(search);

  return (
    <div className="flex flex-col gap-y-4 flex-1">
      <Card>
        <CardContent>
          <div className="flex justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Checklists</h2>
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
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-4">
          {isLoading ? (
            <DataTableSkeleton columns={modelsColumns} />
          ) : (
            <DataTable columns={modelsColumns} data={data?.data ?? []} />
          )}
        </CardContent>
        <CardFooter>
          <MetaPagination meta={data?.meta} />
        </CardFooter>
      </Card>
    </div>
  );
}
