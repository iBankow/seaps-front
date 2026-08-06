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
import { CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import z from "zod";

interface RequestActionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: "approve" | "reject" | null;
  onConfirm: (
    action: "approve" | "reject",
    reasonOrObservation?: string,
    permissions?: string[],
  ) => void;
  requestUserName: string;
  submitting?: boolean;
}

const userSchema = z.object({
  permissions: z.array(z.string()).optional(),
});

type UserFormData = z.infer<typeof userSchema>;

export function RequestActionModal({
  open,
  onOpenChange,
  action,
  onConfirm,
  requestUserName,
  submitting = false,
}: RequestActionModalProps) {
  const form = useForm<UserFormData>({
    defaultValues: {
      permissions: [],
    },
  });

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
      const permissions = isApprove ? form.getValues("permissions") : undefined;
      onConfirm(action, reason.trim() || undefined, permissions);
    }
    setReason("");
    setError("");
    form.reset();
    onOpenChange(false);
  };

  const handleCancel = () => {
    setReason("");
    setError("");
    form.reset();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="min-w-2xl">
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
                <p className="text-lg mb-6 text-green-800 dark:text-green-200">
                  ✓ O usuário terá acesso ao sistema após a aprovação.
                </p>
                <Form {...form}>
                  <CardContent className="p-0">
                    <FormField
                      control={form.control}
                      name="permissions"
                      render={({ field }) => {
                        const isAdmin = field.value?.includes("*");
                        const isOrgAdmin =
                          field.value?.includes("organization:*");
                        const isEvaluator = field.value?.includes("evaluator");
                        const hasFullAccess = isAdmin || isOrgAdmin;

                        return (
                          <div className="space-y-3">
                            {/* Administrador Total */}
                            <div className="flex flex-row items-center justify-between rounded-lg border-2 border-primary/20 bg-primary/5 p-4 shadow-sm">
                              <div className="space-y-0.5 flex-1">
                                <div className="flex items-center gap-2">
                                  <FormLabel className="mb-0 text-base font-bold">
                                    Administrador Total
                                  </FormLabel>
                                  <Badge variant="default" className="ml-2">
                                    Acesso Completo
                                  </Badge>
                                </div>
                                <FormDescription className="text-xs">
                                  Acesso total ao sistema incluindo todas as
                                  organizações e configurações avançadas.
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={isAdmin}
                                  onCheckedChange={(checked) => {
                                    let newPermissions = field.value || [];
                                    if (checked) {
                                      newPermissions = [...newPermissions, "*"];
                                    } else {
                                      newPermissions = newPermissions.filter(
                                        (f) => f !== "*",
                                      );
                                    }
                                    field.onChange(newPermissions);
                                  }}
                                  className="data-[state=checked]:bg-primary"
                                />
                              </FormControl>
                            </div>

                            <Separator className="my-4" />

                            {/* Administrador da Organização */}
                            <div className="flex flex-row items-center justify-between rounded-lg border-2 border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/20 p-4 shadow-sm">
                              <div className="space-y-0.5 flex-1">
                                <div className="flex items-center gap-2">
                                  <FormLabel className="mb-0 text-base font-bold">
                                    Administrador da Organização
                                  </FormLabel>
                                  <Badge
                                    variant="secondary"
                                    className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                  >
                                    Acesso Completo
                                  </Badge>
                                </div>
                                <FormDescription className="text-xs">
                                  Acesso total aos recursos da própria
                                  organização do usuário, incluindo todas as
                                  permissões específicas.
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={isOrgAdmin || isAdmin}
                                  disabled={isAdmin}
                                  onCheckedChange={(checked) => {
                                    let newPermissions =
                                      field.value?.filter((f) => f !== "*") ||
                                      [];
                                    if (checked) {
                                      newPermissions = [
                                        ...newPermissions,
                                        "organization:*",
                                      ];
                                    } else {
                                      newPermissions = newPermissions.filter(
                                        (f) => f !== "organization:*",
                                      );
                                    }
                                    field.onChange(newPermissions);
                                  }}
                                  className="data-[state=checked]:bg-blue-600"
                                />
                              </FormControl>
                            </div>

                            <Separator className="my-4" />

                            {/* Validador */}
                            <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel className="mb-0 text-base font-semibold">
                                  Validador
                                </FormLabel>
                                <FormDescription className="text-xs">
                                  Permissão para validar checklists concluídos.
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={
                                    field.value?.includes(
                                      "checklist:validate",
                                    ) || hasFullAccess
                                  }
                                  disabled={hasFullAccess}
                                  onCheckedChange={(checked) => {
                                    let newPermissions =
                                      field.value?.filter(
                                        (f) =>
                                          f !== "*" && f !== "organization:*",
                                      ) || [];
                                    if (checked) {
                                      newPermissions = [
                                        ...newPermissions,
                                        "checklist:validate",
                                      ];
                                    } else {
                                      newPermissions = newPermissions.filter(
                                        (f) => f !== "checklist:validate",
                                      );
                                    }
                                    field.onChange(newPermissions);
                                  }}
                                />
                              </FormControl>
                            </div>

                            {/* Avaliador */}
                            <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel className="mb-0 text-base font-semibold">
                                  Acesso como Avaliador
                                </FormLabel>
                                <FormDescription className="text-xs">
                                  Permissão para avaliar e validar itens.
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={isEvaluator || hasFullAccess}
                                  disabled={hasFullAccess}
                                  onCheckedChange={(checked) => {
                                    let newPermissions =
                                      field.value?.filter(
                                        (f) =>
                                          f !== "*" && f !== "organization:*",
                                      ) || [];
                                    if (checked) {
                                      newPermissions = [
                                        ...newPermissions,
                                        "evaluator",
                                      ];
                                    } else {
                                      newPermissions = newPermissions.filter(
                                        (f) => f !== "evaluator",
                                      );
                                    }
                                    field.onChange(newPermissions);
                                  }}
                                />
                              </FormControl>
                            </div>
                          </div>
                        );
                      }}
                    />
                  </CardContent>
                </Form>
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
