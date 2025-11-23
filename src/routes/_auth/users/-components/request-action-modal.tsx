import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Check, XCircle } from "lucide-react";

interface RequestActionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: "approve" | "reject" | null;
  onConfirm: (
    action: "approve" | "reject",
    reasonOrObservation?: string
  ) => void;
  requestUserName: string;
  submitting?: boolean;
}

export function RequestActionModal({
  open,
  onOpenChange,
  action,
  onConfirm,
  requestUserName,
  submitting = false,
}: RequestActionModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const isReject = action === "reject";
  const isApprove = action === "approve";

  const handleConfirm = () => {
    if (isReject) {
      if (!reason.trim()) {
        setError("O motivo da rejeição é obrigatório");
        return;
      }

      if (reason.trim().length < 10) {
        setError("O motivo deve ter pelo menos 10 caracteres");
        return;
      }
    }

    if (action) {
      onConfirm(action, reason.trim() || undefined);
    }
    setReason("");
    setError("");
    onOpenChange(false);
  };

  const handleCancel = () => {
    setReason("");
    setError("");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle
            className={`flex items-center gap-2 ${isReject ? "text-red-600" : "text-green-600"}`}
          >
            {isReject ? (
              <>
                <XCircle className="h-5 w-5" />
                Rejeitar Solicitação
              </>
            ) : (
              <>
                <Check className="h-5 w-5" />
                Aprovar Solicitação
              </>
            )}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4 pt-2">
            <p>
              Você está prestes a{" "}
              <span className="font-semibold text-foreground">
                {isReject ? "rejeitar" : "aprovar"}
              </span>{" "}
              a solicitação de ativação de{" "}
              <span className="font-semibold text-foreground">
                {requestUserName}
              </span>
              .
            </p>

            {isReject && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="reason" className="text-foreground">
                    Motivo da Rejeição *
                  </Label>
                  <Textarea
                    id="reason"
                    placeholder="Explique o motivo da rejeição..."
                    value={reason}
                    onChange={(e) => {
                      setReason(e.target.value);
                      setError("");
                    }}
                    className={`min-h-32 ${error ? "border-red-500" : ""}`}
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center">
                    {error && <p className="text-xs text-red-600">{error}</p>}
                    <p
                      className={`text-xs text-muted-foreground ${error ? "ml-auto" : ""}`}
                    >
                      {reason.length}/500
                    </p>
                  </div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md border border-amber-200 dark:border-amber-800">
                  <p className="text-xs text-amber-800 dark:text-amber-200">
                    ⚠️ Esta ação não pode ser desfeita. O usuário será
                    notificado sobre a rejeição.
                  </p>
                </div>
              </>
            )}

            {isApprove && (
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md border border-green-200 dark:border-green-800">
                <p className="text-xs text-green-800 dark:text-green-200">
                  ✓ O usuário terá acesso ao sistema após a aprovação.
                </p>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={submitting}>
            Cancelar
          </AlertDialogCancel>
          <Button
            variant={isReject ? "destructive" : "default"}
            onClick={handleConfirm}
            className="gap-2"
            disabled={submitting}
          >
            {submitting ? (
              "Processando..."
            ) : isReject ? (
              <>
                <XCircle className="h-4 w-4" />
                Confirmar Rejeição
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Confirmar Aprovação
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
