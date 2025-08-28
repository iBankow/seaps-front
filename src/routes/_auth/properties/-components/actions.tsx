"use client";

import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import type { Row } from "@tanstack/react-table";
import { ChevronRight, Ellipsis, Pen, Trash2 } from "lucide-react";
import { useState } from "react";

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

export const Actions = ({ row }: { row: Row<Column> }) => {
  const { user } = useAuth();
  const deleteDialog = useModal();

  const [loading, setLoading] = useState(false);

  const handleDeleteProperty = () => {
    setLoading(true);
    toast.promise(api.delete("/api/v1/properties/" + row.original.id), {
      loading: "Excluindo imóvel...",
      success: `Imóvel ${row.original.name} excluído com sucesso!`,
      finally: () => setLoading(false),
    });

    // router.navigate({ to: ".", replace: true, reloadDocument: true });
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
              Tem certeza que deseja excluir o imóvel "{row.original.name}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProperty}
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
              <Link
                to="/properties/$propertyId"
                params={{ propertyId: row.original.id }}
              >
                <ChevronRight size={16} />
                Visualizar
              </Link>
            </DropdownMenuItem>
            {user?.role !== "EVALUATOR" && (
              <>
                <DropdownMenuItem asChild>
                  <Link to={"/properties/" + row.original.id + "/edit"}>
                    <Pen size={16} />
                    Editar
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={loading}
                  onClick={() => deleteDialog.show()}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 size={16} className="text-red-600" />
                  Excluir
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
