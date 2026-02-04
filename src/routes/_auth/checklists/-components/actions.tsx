"use client";

import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import type { Row } from "@tanstack/react-table";
import {
  Check,
  ChevronRight,
  Ellipsis,
  Flag,
  Pen,
  Printer,
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
import { ValidateDialog } from "./dialogs/validate-dialog";

export const Actions = ({ row }: { row: Row<Column> }) => {
  const router = useRouter();
  const reopenDialog = useModal();
  const deleteDialog = useModal();
  const finishDialog = useModal();
  const validateDialog = useModal();

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
      },
    );
  };

  const handleReopenChecklist = () => {
    setLoading(true);
    toast.promise(
      api.put("/api/v1/checklists/" + row.original.id + "/re-open"),
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
      },
    );
  };

  const handleValidateChecklist = () => {
    setLoading(true);
    toast.promise(
      api.put("/api/v1/checklists/" + row.original.id + "/validate"),
      {
        loading: "Validando checklist...",
        success: `Checklist ${row.original?.sid} - ${row.original?.property?.name} validado!`,
        error: "Erro ao validar o checklist",
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
      },
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

      <ValidateDialog
        row={row}
        onValidate={handleValidateChecklist}
        onOpenChange={validateDialog.toggle}
        open={validateDialog.visible}
      />

      {/* <NotificationDialog
        row={row}
        open={notificationDialog.visible}
        onOpenChange={notificationDialog.toggle}
      /> */}

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
                to="/checklists/$checklistId"
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
              disabled={loading || row.original.status !== "CLOSED"}
              onClick={() => validateDialog.show()}
            >
              <Check size={16} />
              Validar
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
