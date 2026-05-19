import { DataTable } from "@/components/data-table";
import { MetaPagination } from "@/components/meta-pagination";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTableSkeleton } from "@/components/skeletons/data-table";

import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { usePropertiesList } from "../api/properties";
import { columns } from "./list-components/columns";
import { DataFilterForm } from "./list-components/filter-form";

export function PropertiesList({ params }: { params: any }) {
  const { data, isLoading } = usePropertiesList(params);

  const properties = data?.data || [];
  return (
    <div className="flex flex-col gap-y-4 flex-1">
      <Card>
        <CardContent>
          <div className="flex justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Imóveis</h2>
            </div>
            <div className="self-end">
              <Button asChild>
                <Link to="/properties/create">
                  <Plus />
                  Criar Imóvel
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-4">
          <DataFilterForm data={data?.data} totalRecords={data?.meta?.total} />
          {isLoading ? (
            <DataTableSkeleton columns={columns} />
          ) : (
            <DataTable columns={columns} data={properties} />
          )}
        </CardContent>
        <CardFooter>
          <MetaPagination meta={data?.meta} />
        </CardFooter>
      </Card>
    </div>
  );
}
