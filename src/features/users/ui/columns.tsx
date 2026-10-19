"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { formatDate } from "@/lib/format";
import { Actions } from "./actions";
import type { User } from "../types";

export const columns: ColumnDef<User>[] = [
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
        "truncate hidden md:table-cell text-primary hover:text-primary/80",
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
      return formatDate(row.created_at);
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
