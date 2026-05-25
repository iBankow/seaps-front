import type { ColumnDef } from "@tanstack/react-table";
import { getFirstAndLastName } from "@/lib/utils";
import { format } from "date-fns";
import { Actions } from "./actions";
import { StatusBadge } from "@/components/status-badge";
import { Link } from "@tanstack/react-router";
import { ClassificationBadge } from "@/components/classification-badge";

export type Column = {
  user: {
    name: string;
  } | null;
  organization: {
    name: string;
  };
  property: {
    name: string;
  };
} & any;

export const columns: ColumnDef<Column>[] = [
  {
    accessorKey: "sid",
    header: "ID",
    cell({ row }) {
      return (
        <Link
          to="/checklists/$checklistId"
          params={{ checklistId: row.original.id }}
          className="font-mono text-sky-400 hover:text-sky-700"
          preload={false}
        >
          {row.original.sid}
        </Link>
      );
    },
    meta: {
      headerClassName: "hidden md:table-cell",
      cellClassName: "truncate hidden md:table-cell",
    },
  },
  {
    accessorKey: "organization",
    header: "Orgão",
    accessorFn(row) {
      return row.organization.name;
    },
    meta: {
      headerClassName: "hidden md:table-cell",
      cellClassName: "truncate hidden md:table-cell",
    },
  },
  {
    accessorKey: "property",
    header: "Imóvel",
    meta: {
      size: 300,
    },
    cell({ row }) {
      return (
        <p className="truncate" title={row.original.property.name}>
          {row.original.property.name}
        </p>
      );
    },
  },
  {
    accessorKey: "city",
    header: "Cidade",
    meta: {
      size: 300,
    },
    cell({ row }) {
      return (
        <p className="truncate" title={row.original.property.name}>
          {row.original.property.city ?? "--"}
        </p>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell({ row }) {
      return <StatusBadge status={row.original.status!} />;
    },
  },
  {
    accessorKey: "score",
    header: "Pontuação",
    accessorFn(row) {
      return row.status === "CLOSED" ? `${Number(row.score).toFixed(2)}` : "--";
    },
  },
  {
    accessorKey: "classification",
    header: "Classificação",
    accessorFn(row) {
      return row.organization.name;
    },
    cell({ row }) {
      return row.original.classification !== null ? (
        <ClassificationBadge classification={row.original.classification} />
      ) : (
        "--"
      );
    },
    meta: {
      headerClassName: "hidden md:table-cell",
      cellClassName: "truncate hidden md:table-cell",
    },
  },
  {
    accessorKey: "is_returned",
    header: "Retorno",
    accessorFn(row) {
      return row.is_returned ? `${row.return}º Retorno` : "Não";
    },
  },
  {
    accessorKey: "user",
    header: "Responsável",
    accessorFn(row) {
      return row.user?.name ? getFirstAndLastName(row.user?.name) : "--";
    },
    meta: {
      headerClassName: "hidden md:table-cell",
      cellClassName: "truncate hidden md:table-cell",
    },
  },
  {
    accessorKey: "finished_at",
    header: "Finalizado em",
    accessorFn(row) {
      return row.finished_at
        ? format(new Date(row.finished_at), "dd/MM/yyyy")
        : "--";
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
