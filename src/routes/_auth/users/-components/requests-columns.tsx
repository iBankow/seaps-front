"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export type RequestColumn = {
  id: string;
  user_name: string;
  user_email: string;
  user_cpf?: string;
  organization_name: string;
  organization_acronym: string;
  justification: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejection_reason?: string;
  reviewed_by?: string;
  reviewer_name?: string;
  created_at: string;
  updated_at: string;
};

interface ActionsContext {
  onView?: (request: RequestColumn) => void;
}

export const createRequestsColumns = (
  context?: ActionsContext
): ColumnDef<RequestColumn>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell({ row }) {
      return <span className="font-mono truncate">{row.original.id}</span>;
    },
    meta: {
      headerClassName: "hidden md:table-cell",
      cellClassName: "truncate hidden md:table-cell",
      size: 90,
    },
  },
  {
    accessorKey: "user_name",
    header: "Nome",
  },
  {
    accessorKey: "user_email",
    header: "Email",
    meta: {
      headerClassName: "hidden md:table-cell",
      cellClassName: "truncate hidden md:table-cell max-w-40",
    },
  },
  {
    accessorKey: "organization_name",
    header: "Organização",
    cell({ row }) {
      return (
        <span className="truncate">
          {row.original.organization_acronym || row.original.organization_name}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell({ row }) {
      const statusMap = {
        PENDING: { label: "PENDENTE", variant: "secondary" as const },
        APPROVED: { label: "APROVADO", variant: "green" as const },
        REJECTED: { label: "REJEITADO", variant: "red" as const },
      };
      const status = statusMap[row.original.status];
      return <Badge variant={status.variant}>{status.label}</Badge>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Solicitado em",
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
    cell: ({ row }) => {
      return (
        <Button
          size="sm"
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => context?.onView?.(row.original)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      );
    },
  },
];
