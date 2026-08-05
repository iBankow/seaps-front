import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { Actions } from "./actions";
import { formatDateShort } from "@/lib/format";

const PROPERTY_TYPE_ENUM = {
  OWN: {
    label: "PRÓPRIO",
    style: "border-blue-800 bg-blue-200 text-blue-900 hover:bg-blue-200/80",
  },
  RENTED: {
    label: "ALUGADO",
    style:
      "border-yellow-800 bg-yellow-200 text-yellow-900 hover:bg-yellow-200/80",
  },
  GRANT: {
    label: "CONCESSÃO",
    style: "border-red-800 bg-red-200 text-red-900 hover:bg-red-200/80",
  },
};

type PROPERTY_TYPE = "OWN" | "RENTED" | "GRANT";

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
    accessorKey: "id",
    header: "ID",
    cell({ row }) {
      return (
        <Link
          title={row.original.id}
          to="/properties/$propertyId"
          params={{ propertyId: row.original.id }}
          className="font-mono truncate"
        >
          {row.original.id}
        </Link>
      );
    },
    meta: {
      headerClassName: "hidden md:table-cell",
      cellClassName:
        "truncate hidden md:table-cell text-sky-400 hover:text-sky-700",
      size: 80,
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
      size: 130,
    },
  },
  {
    accessorKey: "name",
    header: "Nome",
    meta: {
      cellClassName: "truncate max-w-xs",
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
      size: 200,
    },
  },
  {
    accessorKey: "person",
    header: "Responsável",
    accessorFn(row) {
      return row.person?.name || "--";
    },
    meta: {
      headerClassName: "hidden md:table-cell",
      cellClassName: "truncate hidden md:table-cell",
      size: 200,
    },
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell({ row }) {
      return PROPERTY_TYPE_ENUM[row.original.type as PROPERTY_TYPE] ? (
        <Badge
          className={
            PROPERTY_TYPE_ENUM[row.original.type as PROPERTY_TYPE].style
          }
        >
          {PROPERTY_TYPE_ENUM[row.original.type as PROPERTY_TYPE].label}
        </Badge>
      ) : (
        "--"
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Criado em",
    accessorFn(row) {
      return formatDateShort(row.updated_at);
    },
    meta: {
      headerClassName: "hidden md:table-cell",
      cellClassName: "truncate hidden md:table-cell",
    },
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row }) => <Actions row={row} />,
  },
];
