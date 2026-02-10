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

export const ValidateDialog = ({
  row,
  onOpenChange,
  open,
  onValidate,
}: any) => {
  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar validação</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja validar o checklist{" "}
            <span className="font-bold underline">
              {row.original?.sid} - {row.original?.property?.name}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onValidate}
            className="bg-green-600 hover:bg-green-700"
          >
            Validar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
