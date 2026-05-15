import { DataTable } from "@/components/data-table";
import { MetaPagination } from "@/components/meta-pagination";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTableSkeleton } from "@/components/skeletons/data-table";

import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { columns } from "./columns";
import { useChecklistsList } from "../api/checklists";
import { DataFilterForm } from "./filter-form";

export function ChecklistList({ params }: { params: any }) {
  const { data, ...rest } = useChecklistsList(params);

  return (
    <div className="flex flex-col gap-y-4 flex-1">
      <Card>
        <CardContent>
          <div className="flex justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Checklists</h2>
            </div>
            <div className="self-end">
              {
                <Button asChild>
                  <Link to="/checklists/create">
                    <Plus />
                    Criar Checklist
                  </Link>
                </Button>
              }
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-4">
          <DataFilterForm />
          <div className="relative">
            {rest.isLoading && (
              <div className="absolute h-full w-full bg-background/50 z-50 rounded-md backdrop-blur-md flex items-center justify-center gap-y-2 flex-col">
                <div className="border-primary size-16 animate-spin rounded-full border-b-2"></div>
                <p className="text-center mt-4 font-mono">Carregando...</p>
              </div>
            )}
            {rest.isLoading ? (
              <DataTableSkeleton columns={columns} />
            ) : (
              <DataTable columns={columns} data={data?.data ?? []} />
            )}
          </div>
        </CardContent>
        <CardFooter>
          <MetaPagination meta={data?.meta} />
        </CardFooter>
      </Card>
    </div>
  );
}
