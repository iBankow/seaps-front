"use client";

import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import type { Row } from "@tanstack/react-table";
import {
  ChevronRight,
  Ellipsis,
  Pen,
  Printer,
  Trash2,
  Undo,
} from "lucide-react";
import { useState } from "react";

import { toast } from "sonner";
// import { ReOpenDialog } from "@/components/reopen-dialog";
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
import { useAuth } from "@/contexts/auth-contexts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ReOpenDialog } from "@/components/reopen-dialog";

export const Actions = ({ row }: { row: Row<Column> }) => {
  const router = useRouter();
  const { user } = useAuth();
  const reopenDialog = useModal();
  const deleteDialog = useModal();

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

  const handleDelete = () => {
    setLoading(true);
    toast.promise(api.delete("/api/v1/checklists/" + row.original.id), {
      loading: "Excluindo checklist...",
      success: `Checklist ${row.original?.property?.name} excluído com sucesso!`,
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
    });
  };

  const handleReopenChecklist = () => {
    setLoading(true);
    api
      .post("/api/checklists/" + row.original.id + "/re-open")
      .then(() => {
        toast.success(`Checklist ${row.original.id} reaberto!`);
        // router.refresh();
        reopenDialog.hide();
      })
      .catch(() => toast.error("Erro ao reabrir o checjlist"))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <ReOpenDialog
        onSubmit={handleReopenChecklist}
        onOpenChange={reopenDialog.toggle}
        open={reopenDialog.visible}
        loading={loading}
      />
      <AlertDialog
        open={deleteDialog.visible}
        onOpenChange={deleteDialog.toggle}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o checklist "{row.original?.sid} -{" "}
              {row.original?.property?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                to="/checklists/$checklistId/items"
                params={{ checklistId: row.original.id }}
              >
                <ChevronRight size={16} />
                Visualizar
              </Link>
            </DropdownMenuItem>
            {user?.role !== "EVALUATOR" && (
              <>
                <DropdownMenuItem
                  disabled={row.original.status === "CLOSED"}
                  asChild
                >
                  <Link to={"/checklists/" + row.original.id + "/edit"}>
                    <Pen size={16} />
                    Editar
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={loading || row.original.status === "OPEN"}
                  onClick={() => reopenDialog.show()}
                >
                  <Undo size={16} />
                  Reabrir
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem
              disabled={row.original.status === "OPEN" || loading}
              onClick={handleGetReport}
            >
              <Printer size={16} />
              Relatório
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
