import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const DeleteDialog = ({ image, setLoad }: any) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    setLoading(true);
    toast.promise(
      api.delete(
        `/api/v1/checklist-items/${image.checklist_item_id}/images/${image.id}`
      ),
      {
        loading: "Excluindo imagem...",
        success: `Imagem '${image.image}' excluída com sucesso!`,
        finally: () => {
          setLoading(false);
          setLoad((prev: boolean) => !prev);
        },
      }
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="flex-1">
          <Trash2 className="mr-2 h-4 w-4" />
          Remover
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir a imagem
            <br />
            <span className="font-bold underline">'{image.image}'</span> ?
            <br />
            Esta ação não pode ser desfeita.
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
