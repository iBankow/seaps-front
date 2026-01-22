"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Actions } from "./actions";
import { Link } from "@tanstack/react-router";

export type Column = {
  organization: {
    name: string;
  };
  person?: {
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
          to="/users/$userId"
          params={{ userId: row.original.id }}
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
      size: 90,
    },
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "organization",
    header: "Organização",
    accessorFn(row) {
      return row.organization?.acronym;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    meta: {
      headerClassName: "hidden md:table-cell",
      cellClassName: "truncate hidden md:table-cell max-w-40",
    },
  },
  {
    accessorKey: "is_active",
    header: "Ativo",
    cell({ row }) {
      return (
        <Badge variant={row.original.is_active ? "green" : "red"}>
          {row.original.is_active ? "ATIVO" : "DESATIVADO"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Criado em",
    accessorFn(row) {
      return format(new Date(row.created_at), "dd/MM/yyyy");
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
