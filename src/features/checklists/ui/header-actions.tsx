import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { useChecklist } from "@/contexts/checklist-context";
import { PermissionGate } from "@/features/auth";
import { FinishDialog } from "./dialogs/finish-dialog";
import { downloadChecklistReport } from "../lib/download-report";

/**
 * Par de ações do card de detalhe: "Exportar PDF" e "Fechar", como no design.
 * "Fechar" só aparece enquanto o checklist está aberto — depois de finalizado
 * a ação é reabrir, que vive no menu da listagem.
 */
export function ChecklistHeaderActions() {
  const { checklist } = useChecklist();
  const finishDialog = useModal();

  const isOpen = checklist.status === "OPEN";

  return (
    <>
      <FinishDialog
        row={{ original: checklist }}
        onOpenChange={finishDialog.toggle}
        open={finishDialog.visible}
      />

      <div className="mt-4 flex gap-2">
        <Button
          className="flex-1"
          onClick={() => downloadChecklistReport(checklist)}
        >
          Exportar PDF
        </Button>

        {isOpen && (
          <PermissionGate permissions="checklists:edit">
            <Button
              variant="outline"
              className="flex-1"
              onClick={finishDialog.show}
            >
              Fechar
            </Button>
          </PermissionGate>
        )}
      </div>
    </>
  );
}
