"use client";

import { Button } from "@/components/ui/button";
import type { Row } from "@tanstack/react-table";
import { ChevronRight, Ellipsis, Pen, Trash2 } from "lucide-react";

import { toast } from "sonner";
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
import { Link } from "@tanstack/react-router";

import { PermissionGate } from "@/features/auth";
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
import { useDeleteUser } from "../api/users";
import type { User } from "../types";

export const Actions = ({ row }: { row: Row<User> }) => {
  const deleteDialog = useModal();
  const { mutateAsync: deleteUser, isPending: loading } = useDeleteUser();

  const handleDeleteUser = () => {
    deleteUser(row.original.id)
      .then(() => {
        toast.success(`Usuário ${row.original.name} excluído com sucesso!`);
        deleteDialog.hide();
      })
      .catch(() => toast.error("Erro ao excluir o usuário"));
  };

  return (
    <>
      <AlertDialog
        open={deleteDialog.visible}
        onOpenChange={deleteDialog.toggle}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o usuário "{row.original.name}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
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
          <DropdownMenuLabel>
            ID: {row.original.id.slice(0, 8)}...
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link to="/users/$userId" params={{ userId: row.original.id }}>
                <ChevronRight size={16} />
                Visualizar
              </Link>
            </DropdownMenuItem>
            <PermissionGate permissions="users:edit">
              <DropdownMenuItem asChild>
                <Link to={"/users/" + row.original.id + "/edit"}>
                  <Pen size={16} />
                  Editar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={loading}
                onClick={() => deleteDialog.show()}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 size={16} />
                Excluir
              </DropdownMenuItem>
            </PermissionGate>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
