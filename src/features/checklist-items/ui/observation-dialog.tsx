"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useChecklistItem, useUpdateChecklistItem } from "../api/checklist-items";
import type { ChecklistItem } from "../types";

interface ObservationDialogProps {
  item: ChecklistItem;
  status: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ObservationDialog = ({
  item,
  status,
  open,
  onOpenChange,
}: ObservationDialogProps) => {
  // Busca via cache do tanstack query (com fallback pro item recebido) para
  // sempre refletir o valor salvo mais recente, mesmo se o card que abriu o
  // dialog estiver com uma cópia local desatualizada do item.
  const { data: checklistItem = item } = useChecklistItem(item.id, item);
  const [observation, setObservation] = useState(checklistItem.observation || "");
  const { mutateAsync: updateObservation, isPending } = useUpdateChecklistItem(
    item.id,
  );

  useEffect(() => {
    if (open) {
      setObservation(checklistItem.observation || "");
    }
  }, [open, checklistItem.observation]);

  const handleSave = async () => {
    await updateObservation({ observation })
      .then(() => {
        toast.success("Observação salva com sucesso!");
        onOpenChange(false);
      })
      .catch(() => toast.error("Não foi possível salvar a observação."));
  };

  const IS_CLOSE = ["APPROVED", "CLOSED"].includes(status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Observação</DialogTitle>
          <DialogDescription>
            Adicione uma observação para o item: {item.item?.name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Digite sua observação..."
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            disabled={IS_CLOSE}
            className="min-h-[100px]"
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isPending || IS_CLOSE}>
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
