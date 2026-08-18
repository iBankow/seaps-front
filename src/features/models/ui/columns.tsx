import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronRight, Pen } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { Model } from "../types";

export const columns: ColumnDef<Model>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell({ row }) {
      return (
        <Link
          title={row.original.id}
          to="/models/$modelId"
          params={{ modelId: row.original.id }}
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
      size: 80,
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
  },
  {
    accessorKey: "description",
    header: "Descrição",
    accessorFn(row) {
      return row.description || "--";
    },
    meta: {
      headerClassName: "hidden md:table-cell",
      cellClassName: "truncate hidden md:table-cell max-w-40",
    },
  },
  {
    accessorKey: "created_at",
    header: "Criado em",
    cell({ row }) {
      return (
        <span className="font-mono text-xs text-muted-foreground">
          {formatDate(row.original.created_at)}
        </span>
      );
    },
    meta: {
      headerClassName: "hidden md:table-cell",
      cellClassName: "truncate hidden md:table-cell",
    },
  },
  {
    accessorKey: "updated_at",
    header: "Atualizado em",
    cell({ row }) {
      return (
        <span className="font-mono text-xs text-muted-foreground">
          {formatDate(row.original.updated_at)}
        </span>
      );
    },
    meta: {
      headerClassName: "hidden md:table-cell",
      cellClassName: "truncate hidden md:table-cell",
    },
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell({ row }) {
      return (
        <div className="flex gap-1">
          <Button variant="default" className="h-6 w-6 p-2" asChild>
            <Link to={"/models/" + row.original.id}>
              <ChevronRight size={16} />
            </Link>
          </Button>
          <Button variant="secondary" className="h-6 w-6 p-2" asChild>
            <Link to={"/models/" + row.original.id + "/edit"}>
              <Pen size={16} />
            </Link>
          </Button>
        </div>
      );
    },
  },
];
