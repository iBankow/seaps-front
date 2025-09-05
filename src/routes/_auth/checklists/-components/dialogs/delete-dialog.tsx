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
import { api } from "@/lib/api";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export const DeleteDialog = ({ row, onOpenChange, open }: any) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = () => {
    setLoading(true);
    toast.promise(api.delete("/api/v1/checklists/" + row.original.id), {
      loading: "Excluindo checklist...",
      success: `Checklist ${row.original?.sid} - ${row.original?.property?.name} excluído com sucesso!`,
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

  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o checklist{" "}
            <span className="font-bold underline">
              {row.original?.sid} - {row.original?.property?.name}
            </span>
            ? Esta ação não pode ser desfeita.
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
  );
};
