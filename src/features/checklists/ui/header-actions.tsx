import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal";
import { useChecklist } from "@/contexts/checklist-context";
import { PermissionGate } from "@/features/auth";
import {
  ChevronDown,
  Edit,
  FileText,
  Flag,
  History,
  List,
  Printer,
} from "lucide-react";
import { FinishDialog } from "./dialogs/finish-dialog";
import { downloadChecklistReport } from "../lib/download-report";

/**
 * Ações do card de detalhe, reunidas num único dropdown "Ações" para não
 * ocupar espaço no header: navegação (itens, edição, histórico, notificação)
 * e as ações "Exportar PDF" / "Fechar" que antes eram botões soltos.
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

      <div className="mt-4">
        <Button
          className="mb-2 w-full"
          nativeButton={false}
          render={
            <Link
              to="/checklists/$checklistId/items"
              params={{ checklistId: checklist.id }}
            />
          }
        >
          <List size={16} />
          Ver Itens
        </Button>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" className="w-full justify-between" />
            }
          >
            Ações
            <ChevronDown />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-(--anchor-width)">
            <DropdownMenuItem
              render={
                <Link
                  to="/checklists/$checklistId/items"
                  params={{ checklistId: checklist.id }}
                />
              }
            >
              <List size={16} />
              Ver Itens
            </DropdownMenuItem>

            {isOpen && (
              <DropdownMenuItem
                render={
                  <Link
                    to="/checklists/$checklistId/edit"
                    params={{ checklistId: checklist.id }}
                  />
                }
              >
                <Edit size={16} />
                Editar
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              render={
                <Link
                  to="/checklists/$checklistId/history"
                  params={{ checklistId: checklist.id }}
                />
              }
            >
              <History size={16} />
              Histórico
            </DropdownMenuItem>

            {!isOpen && checklist.classification !== 2 && (
              <DropdownMenuItem
                render={
                  <Link
                    to="/checklists/$checklistId/notification"
                    params={{ checklistId: checklist.id }}
                  />
                }
              >
                <FileText size={16} />
                Notificação
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => downloadChecklistReport(checklist)}
            >
              <Printer size={16} />
              Exportar PDF
            </DropdownMenuItem>

            {isOpen && (
              <PermissionGate permissions="checklists:edit">
                <DropdownMenuItem onClick={finishDialog.show}>
                  <Flag size={16} />
                  Fechar
                </DropdownMenuItem>
              </PermissionGate>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
