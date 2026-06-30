import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Actions } from "./actions";
import { Link } from "@tanstack/react-router";
import { getFirstAndLastName } from "@/lib/utils";
import { PropertyBadge } from "@/components/property-badge";

export type Column = {
  organization: {
    name: string;
  };
  person?: {
    name: string;
  };
  user?: {
    name: string;
  };
} & any;

export const columns: ColumnDef<Column>[] = [
  {
    accessorKey: "name",
    header: "Nome",
    cell({ row }) {
      return (
        <Link
          title={row.original.name}
          to="/properties/$propertyId"
          params={{ propertyId: row.original.id }}
          className="text-sky-400 hover:text-sky-700 block overflow-ellipsis truncate whitespace-nowrap"
          preload={false}
        >
          {row.original.name}
        </Link>
      );
    },
    meta: {
      headerClassName: "w-2/5",
    },
  },
  {
    accessorKey: "organization",
    header: "Orgão",
    accessorFn(row) {
      return row.organization.acronym;
    },
    meta: {
      headerClassName: "hidden md:table-cell",
      cellClassName: "truncate hidden md:table-cell",
    },
  },
  {
    accessorKey: "city",
    header: "Cidade",
    accessorFn(row) {
      return row.city || "--";
    },
    meta: {
      headerClassName: "hidden md:table-cell",
      cellClassName: "truncate hidden md:table-cell",
    },
  },
  {
    accessorKey: "person",
    header: "Responsável",
    accessorFn(row) {
      return getFirstAndLastName(row.person?.name) || "--";
    },
    meta: {
      headerClassName: "hidden md:table-cell",
      cellClassName: "truncate hidden md:table-cell",
    },
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell({ row }) {
      return row.original.type ? (
        <PropertyBadge type={row.original.type} />
      ) : (
        "--"
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Criado em",
    accessorFn(row) {
      return format(new Date(row.created_at || ""), "dd/MM/yyyy");
    },
    meta: {
      headerClassName: "hidden md:table-cell",
      cellClassName: "truncate hidden md:table-cell",
    },
  },
  {
    accessorKey: "updated_at",
    header: "Atualizado em",
    accessorFn(row) {
      return row.updated_at
        ? format(new Date(row.updated_at), "dd/MM/yyyy")
        : "--";
    },
    meta: {
      headerClassName: "hidden lg:table-cell",
      cellClassName: "truncate hidden lg:table-cell",
    },
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row }) => <Actions row={row} />,
    meta: {
      headerClassName: "text-center",
      cellClassName: "text-center",
    },
  },
];
