import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
} from "seaps-front";

export function Default() {
  return (
    <Dialog open modal={false}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Finalizar checklist</DialogTitle>
          <DialogDescription>
            Essa ação marca o checklist como concluído e gera o relatório final. Não é possível
            desfazer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancelar</Button>
          <Button variant="default">Finalizar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
