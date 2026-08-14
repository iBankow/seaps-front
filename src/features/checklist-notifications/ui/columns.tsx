import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";
import { differenceInBusinessDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import type { ChecklistNotificationListItem } from "../types";
import { formatDateTime } from "@/lib/format";

export type Column = ChecklistNotificationListItem;

export const columns: ColumnDef<Column>[] = [
  {
    accessorKey: "checklist",
    header: "Checklist",
    cell({ row }) {
      return (
        <Link
          to="/checklists/$checklistId"
          params={{ checklistId: row.original.checklist_id }}
          className="font-mono text-primary hover:text-primary/80"
          preload={false}
        >
          {row.original.checklist.sid}
        </Link>
      );
    },
  },
  {
    accessorKey: "organization",
    header: "Órgão",
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
    accessorFn(row) {
      return row.property.city || "--";
    },
    meta: {
      headerClassName: "hidden md:table-cell",
      cellClassName: "truncate hidden md:table-cell",
    },
  },
  {
    accessorKey: "generated_by_user",
    header: "Gerado por",
    accessorFn(row) {
      return row.generated_by_user?.name || "--";
    },
    meta: {
      headerClassName: "hidden md:table-cell",
      cellClassName: "truncate hidden md:table-cell",
    },
  },
  {
    accessorKey: "created_at",
    header: "Criado em",
    accessorFn(row) {
      return formatDateTime(row.created_at);
    },
    meta: {
      headerClassName: "hidden md:table-cell",
      cellClassName: "truncate hidden md:table-cell",
    },
  },
  {
    accessorKey: "business_days",
    header: "Dias",
    cell({ row }) {
      const businessDays = differenceInBusinessDays(
        new Date(),
        new Date(row.original.created_at),
      );

      return <Badge variant="secondary">{businessDays}</Badge>;
    },
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell({ row }) {
      return (
        <Button variant="ghost" size="sm" asChild>
          <Link
            to="/checklists/$checklistId/notification"
            params={{ checklistId: row.original.checklist_id }}
            preload={false}
          >
            Ver
            <ChevronRight size={16} />
          </Link>
        </Button>
      );
    },
  },
];
