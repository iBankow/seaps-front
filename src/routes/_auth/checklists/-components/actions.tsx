"use client";

import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import type { Row } from "@tanstack/react-table";
import {
  ChevronRight,
  Ellipsis,
  Flag,
  Pen,
  Printer,
  Scale,
  Trash2,
  Undo,
} from "lucide-react";
import { useState } from "react";

import { toast } from "sonner";
import { ReOpenDialog } from "./dialogs/reopen-dialog";
import { DeleteDialog } from "./dialogs/delete-dialog";
import { FinishDialog } from "./dialogs/finish-dialog";
import { useModal } from "@/hooks/use-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useRouter } from "@tanstack/react-router";

import type { Column } from "./columns";
import { NotificationDialog } from "./dialogs/notification-dialog";

export const Actions = ({ row }: { row: Row<Column> }) => {
  const router = useRouter();
  const reopenDialog = useModal();
  const deleteDialog = useModal();
  const finishDialog = useModal();
  const notificationDialog = useModal();

  const [loading, setLoading] = useState(false);

  const handleGetReport = () => {
    toast.promise(
      api.get("/api/v1/reports/" + row.original.id, {
        responseType: "blob",
      }),
      {
        loading: "Caregando Relatório...",
        success: (data: any) => {
          const blob = new Blob([data.data], { type: "img/pdf" });
          const _url = window.URL.createObjectURL(blob);
          if (_url) {
            const a = document.createElement("a");
            a.href = _url;
            a.download = `${row.original.sid.replace("/", "_")}.pdf`;
            a.click();
            window.URL.revokeObjectURL(_url);
          }
          return `Relatório gerado com sucesso`;
        },
        error: "Erro ao gerar relatório",
      }
    );
  };

  const handleReopenChecklist = () => {
    setLoading(true);
    toast.promise(
      api.post("/api/v1/checklists/" + row.original.id + "/re-open"),
      {
        loading: "Reabrindo checklist...",
        success: `Checklist ${row.original?.sid} - ${row.original?.property?.name} reaberto!`,
        error: "Erro ao reabrir o checklist",
        finally: () => {
          setLoading(false);
          router.navigate({
            to: ".",
            replace: true,
            search: {
              ...router.latestLocation.search,
              refresh: Date.now(),
            },
          });
        },
      }
    );
  };

  return (
    <>
      <ReOpenDialog
        onSubmit={handleReopenChecklist}
        onOpenChange={reopenDialog.toggle}
        open={reopenDialog.visible}
        loading={loading}
      />

      <DeleteDialog
        row={row}
        open={deleteDialog.visible}
        onOpenChange={deleteDialog.toggle}
      />

      <FinishDialog
        row={row}
        onOpenChange={finishDialog.toggle}
        open={finishDialog.visible}
      />

      <NotificationDialog
        row={row}
        open={notificationDialog.visible}
        onOpenChange={notificationDialog.toggle}
      />

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size={"icon"} className="h-7 flex-1">
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>ID: {row.original.sid}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link
                preload={false}
                to="/checklists/$checklistId/items"
                params={{ checklistId: row.original.id }}
              >
                <ChevronRight size={16} />
                Visualizar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={row.original.status === "CLOSED"}
              asChild
            >
              <Link
                preload={false}
                to={"/checklists/" + row.original.id + "/edit"}
              >
                <Pen size={16} />
                Editar
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              disabled={row.original.status === "CLOSED"}
              onClick={() => finishDialog.show()}
            >
              <Flag size={16} />
              Finalizar
            </DropdownMenuItem>

            <DropdownMenuItem
              disabled={loading || row.original.status === "OPEN"}
              onClick={() => reopenDialog.show()}
            >
              <Undo size={16} />
              Reabrir
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={row.original.status === "OPEN" || loading}
              onClick={handleGetReport}
            >
              <Printer size={16} />
              Relatório
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={loading || row.original.status === "OPEN"}
              onClick={() => notificationDialog.show()}
            >
              <Scale size={16} />
              Notificação
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={loading}
              onClick={() => deleteDialog.show()}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 size={16} className="text-red-600" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
