import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ReOpenDialogProps extends React.ComponentProps<typeof Dialog> {
  loading?: boolean;
  onSubmit: () => Promise<void> | void;
}

export function ReOpenDialog({
  onSubmit,
  loading,
  ...props
}: ReOpenDialogProps) {
  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deseja reabrir o checklist?</DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita. O responsável pelo checklist deverá
            finalizar novamente.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose
            render={
              <Button disabled={loading} type="button" variant="outline" />
            }
          >
            Cancelar
          </DialogClose>
          <DialogClose
            render={
              <Button type="submit" onClick={onSubmit} disabled={loading} />
            }
          >
            Confimar
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
