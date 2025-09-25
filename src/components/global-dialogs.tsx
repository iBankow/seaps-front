import { ObservationDialog } from "@/components/observation-dialog";
import { ImageDialog } from "@/components/image-dialog";
import { useDialogContext } from "@/contexts/dialog-context";

export function GlobalDialogs() {
  const { observationDialog, imageDialog } = useDialogContext();

  return (
    <>
      {/* Observation Dialog - Centralizado */}
      {observationDialog.item && (
        <ObservationDialog
          status={observationDialog.status}
          item={observationDialog.item}
          open={observationDialog.isOpen}
          onOpenChange={observationDialog.close}
        />
      )}

      {/* Image Dialog - Centralizado */}
      {imageDialog.item && (
        <ImageDialog
          item={imageDialog.item}
          index={imageDialog.index}
          open={imageDialog.isOpen}
          onOpenChange={imageDialog.close}
        />
      )}
    </>
  );
}
