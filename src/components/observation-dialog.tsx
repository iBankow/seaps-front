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
import { useState } from "react";
import { api } from "@/lib/api";

interface ObservationDialogProps {
  item: any;
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
  const [observation, setObservation] = useState(item.observation || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put(
        `/api/v1/checklists/${item.checklist_id}/items/${item.id}`,
        { observation },
      );
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving observation:", error);
    } finally {
      setLoading(false);
    }
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
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading || IS_CLOSE}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
