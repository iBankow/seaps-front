import { DataTable } from "@/components/data-table";
import { Pagination } from "@/components/pagination";
import { useEffect, useState } from "react";
import { DataTableSkeleton } from "@/components/skeletons/data-table";

import { createFileRoute, useSearch } from "@tanstack/react-router";
import { api } from "@/lib/api";
import { columns } from "./-components/columns";
import { DataFilterForm } from "./-components/filter-form";

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
  const searchParams = useSearch({ from: "/_auth/users/" });

  const page = searchParams.page;
  const perPage = searchParams.per_page;

  const organization = searchParams.organization;
  const role = searchParams.role;
  const name = searchParams.name;
  const email = searchParams.email;

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<any>([]);

  useEffect(() => {
    api
      .get("/api/v1/users", {
        params: {
          page: page,
          per_page: perPage,
          organization,
          role,
          name,
          email,
        },
      })
      .then(({ data }) => {
        setUsers(data.data);
        setMeta(data.meta);
      })
      .finally(() => setLoading(false));
  }, [organization, role, name, email, page, perPage]);

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Usuários</h2>
        </div>
      </div>
      <DataFilterForm />
      {loading ? (
        <DataTableSkeleton columns={columns} />
      ) : (
        <DataTable columns={columns} data={users} />
      )}
      {meta.total > 10 && <Pagination meta={meta} />}
    </div>
  );
}
