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
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useDeleteChecklistItemImage } from "../api/checklist-items";
import type { ChecklistItemImage } from "../types";

export const DeleteDialog = ({ image }: { image: ChecklistItemImage }) => {
  const { mutateAsync: deleteImage, isPending } = useDeleteChecklistItemImage();

  const handleDelete = () => {
    toast.promise(
      deleteImage({
        checklistItemId: image.checklist_item_id,
        imageId: image.id,
      }),
      {
        loading: "Excluindo imagem...",
        success: `Imagem '${image.image}' excluída com sucesso!`,
      },
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
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {isPending ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
