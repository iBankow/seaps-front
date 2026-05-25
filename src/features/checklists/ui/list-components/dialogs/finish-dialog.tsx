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
import { toast } from "sonner";

export const FinishDialog = ({ row, onOpenChange, open }: any) => {
  const router = useRouter();

  const handleFinish = () => {
    toast.promise(
      api.put("/api/v1/checklists/" + row.original.id + "/finish"),
      {
        loading: "Finalizando checklist...",
        success: `Checklist ${row.original?.sid} - ${row.original?.property?.name} finalizado!`,
        error: "Erro ao finalizar o checklist",
        finally: () => {
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
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar finalização</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja finalizar o checklist{" "}
            <span className="font-bold underline">
              {row.original?.sid} - {row.original?.property?.name}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleFinish}
            className="bg-green-600 hover:bg-green-700"
          >
            Finalizar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
