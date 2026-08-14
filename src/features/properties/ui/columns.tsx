import type { ColumnDef } from "@tanstack/react-table";
import { Badge, type badgeVariants } from "@/components/ui/badge";
import type { VariantProps } from "class-variance-authority";
import { Actions } from "./actions";
import { Link } from "@tanstack/react-router";
import { formatDate } from "@/lib/format";

export const PROPERTY_TYPE_ENUM: Record<
  PROPERTY_TYPE,
  { label: string; variant: VariantProps<typeof badgeVariants>["variant"] }
> = {
  OWN: { label: "PRÓPRIO", variant: "outline" },
  RENTED: { label: "ALUGADO", variant: "warning" },
  GRANT: { label: "CONCESSÃO", variant: "destructive" },
};

export type PROPERTY_TYPE = "OWN" | "RENTED" | "GRANT";

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
    cell({ row }) {
      return (
        <span className="font-heading font-semibold tracking-wide uppercase">
          {row.original.name}
        </span>
      );
    },
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
  // {
  //   accessorKey: "address",
  //   header: "Endereço",
  //   meta: {
  //     headerClassName: "hidden lg:table-cell",
  //     cellClassName: "truncate hidden lg:table-cell max-w-xs",
  //   },
  // },
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
      const entry = PROPERTY_TYPE_ENUM[row.original.type as PROPERTY_TYPE];
      return entry ? (
        <Badge variant={entry.variant}>{entry.label}</Badge>
      ) : (
        "--"
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Criado em",
    accessorFn(row) {
      return formatDate(row.created_at || "");
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
        ? formatDate(row.updated_at)
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
  },
];
