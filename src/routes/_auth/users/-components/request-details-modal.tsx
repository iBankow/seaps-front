import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building,
  User,
  Mail,
  Calendar,
  FileText,
  Check,
  X,
} from "lucide-react";
import type { RequestColumn } from "./requests-columns";
import { useState } from "react";
import { RequestActionModal } from "./request-action-modal";

interface RequestDetailsModalProps {
  request: RequestColumn | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove?: (requestId: string, observation?: string, permissions?: string[]) => void;
  onReject?: (requestId: string, reason: string) => void;
  submitting?: boolean;
}

export function RequestDetailsModal({
  request,
  open,
  onOpenChange,
  onApprove,
  onReject,
  submitting = false,
}: RequestDetailsModalProps) {
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<
    "approve" | "reject" | null
  >(null);

  if (!request) return null;

  const handleApproveClick = () => {
    setCurrentAction("approve");
    setActionModalOpen(true);
  };

  const handleRejectClick = () => {
    setCurrentAction("reject");
    setActionModalOpen(true);
  };

  const handleActionConfirm = (
    action: "approve" | "reject",
    reasonOrObservation?: string,
    permissions?: string[],
  ) => {
    if (action === "approve") {
      onApprove?.(request.id, reasonOrObservation, permissions);
    } else {
      if (reasonOrObservation) {
        onReject?.(request.id, reasonOrObservation);
      }
    }
    onOpenChange(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "APPROVED":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "REJECTED":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="secondary" className="gap-1.5">
            {getStatusIcon(status)} Pendente
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge variant="green" className="gap-1.5">
            {getStatusIcon(status)} Aprovado
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="red" className="gap-1.5">
            {getStatusIcon(status)} Rejeitado
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mt-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">
              Detalhes da Solicitação
            </DialogTitle>
            {getStatusBadge(request.status)}
          </div>
          <DialogDescription>
            Solicitação #{request.id.slice(0, 8)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Informações do Usuário */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <User className="h-4 w-4" />
              Informações do Usuário
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Nome</p>
                <p className="text-sm font-medium">{request.user_name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  Email
                </p>
                <p className="text-sm font-medium truncate">
                  {request.user_email}
                </p>
              </div>
              {request.user_cpf && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">CPF</p>
                  <p className="text-sm font-medium">{request.user_cpf}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Informações da Organização */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <Building className="h-4 w-4" />
              Organização Solicitada
            </h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-base font-semibold">
                {request.organization_name}
                {request.organization_acronym && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({request.organization_acronym})
                  </span>
                )}
              </p>
            </div>
          </div>

          <Separator />

          {/* Justificativa */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Justificativa
            </h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {request.justification}
              </p>
            </div>
          </div>

          {/* Motivo da Rejeição */}
          {request.status === "REJECTED" && request.rejection_reason && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-red-600 uppercase tracking-wide flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Motivo da Rejeição
                </h3>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-900 dark:text-red-100 leading-relaxed">
                    {request.rejection_reason}
                  </p>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Datas e Informações Adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground col-span-2">
              <Calendar className="h-4 w-4" />
              <span>
                Solicitado em:{" "}
                <span className="font-medium text-foreground">
                  {format(
                    new Date(request.created_at),
                    "dd/MM/yyyy 'às' HH:mm"
                  )}
                </span>
              </span>
            </div>
            {request.reviewer_name && (
              <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                <User className="h-4 w-4" />
                <span>
                  Analisado por:{" "}
                  <span className="font-medium text-foreground">
                    {request.reviewer_name}
                  </span>
                </span>
              </div>
            )}
          </div>

          {/* Ações */}
          {request.status === "PENDING" && (onApprove || onReject) && (
            <>
              <Separator />
              <div className="flex gap-3 justify-end pt-2">
                {onReject && (
                  <Button
                    variant="destructive"
                    onClick={handleRejectClick}
                    className="gap-2"
                    disabled={submitting}
                  >
                    <X className="h-4 w-4" />
                    Rejeitar
                  </Button>
                )}
                {onApprove && (
                  <Button
                    variant="default"
                    onClick={handleApproveClick}
                    className="gap-2"
                    disabled={submitting}
                  >
                    <Check className="h-4 w-4" />
                    Aprovar
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>

      <RequestActionModal
        open={actionModalOpen}
        onOpenChange={setActionModalOpen}
        action={currentAction}
        onConfirm={handleActionConfirm}
        requestUserName={request.user_name}
        submitting={submitting}
      />
    </Dialog>
  );
}
