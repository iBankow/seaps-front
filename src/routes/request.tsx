import { createFileRoute, redirect } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Building,
  UserPlus,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import { format } from "date-fns";

// Schema de validação do formulário
const requestFormSchema = z.object({
  organization_id: z.string().min(1, "Órgão é obrigatório"),
  justification: z
    .string()
    .min(10, "Justificativa deve ter pelo menos 10 caracteres")
    .max(500, "Justificativa deve ter no máximo 500 caracteres"),
});

type RequestFormData = z.infer<typeof requestFormSchema>;

interface Organization {
  id: string;
  name: string;
  acronym?: string;
}

interface UserRequest {
  id: string;
  organization_id: string;
  organization_name?: string;
  organization_acronym?: string;
  justification: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejection_reason?: string;
  reviewer_name?: string;
  created_at: string;
  updated_at: string;
}

export const Route = createFileRoute("/request")({
  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
  }),
  component: RouteComponent,
  beforeLoad: ({ context, search }) => {
    if (context.auth.user?.is_active) {
      throw redirect({ to: search.redirect || "/" });
    }
  },
});

function RouteComponent() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<UserRequest | null>(
    null
  );
  const [loadingRequest, setLoadingRequest] = useState(true);

  const form = useForm<RequestFormData>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      organization_id: "",
      justification: "",
    },
  });

  // Carregar solicitação atual do usuário
  useEffect(() => {
    const loadCurrentRequest = async () => {
      try {
        setLoadingRequest(true);
        const response = await api.get("/api/v1/auth/request");
        setCurrentRequest(response.data);
      } catch (error: any) {
        // Se retornar 404, significa que não há solicitação
        if (error.response?.status !== 404) {
          console.error("Erro ao carregar solicitação:", error);
        }
      } finally {
        setLoadingRequest(false);
      }
    };

    loadCurrentRequest();
  }, []);

  // Carregar organizações
  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/v1/organizations?per_page=100");
        setOrganizations(response.data.data || []);
      } catch (error) {
        console.error("Erro ao carregar organizações:", error);
        toast.error("Erro ao carregar lista de órgãos");
      } finally {
        setLoading(false);
      }
    };

    loadOrganizations();
  }, []);

  // Submissão do formulário
  const onSubmit = async (data: RequestFormData) => {
    try {
      setSubmitting(true);

      // Aqui você faria a chamada para a API para criar a solicitação
      const response = await api.post("/api/v1/user-requests", data);

      if (response.status === 201) {
        toast.success(
          "Solicitação enviada com sucesso! Você receberá uma resposta em breve."
        );
        form.reset();
        setCurrentRequest(response.data);
      }
    } catch (error: any) {
      console.error("Erro ao enviar solicitação:", error);

      if (error.response?.status === 409) {
        toast.error("Já existe uma solicitação pendente para este usuário.");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Erro ao enviar solicitação. Tente novamente.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-5 w-5" />;
      case "APPROVED":
        return <CheckCircle2 className="h-5 w-5" />;
      case "REJECTED":
        return <XCircle className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="secondary" className="gap-1">
            {getStatusIcon(status)} Pendente
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge variant="green" className="gap-1">
            {getStatusIcon(status)} Aprovado
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="red" className="gap-1">
            {getStatusIcon(status)} Rejeitado
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Solicitação de Ativação
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Selecione o órgão e justifique sua solicitação de acesso
          </p>
        </div>

        {/* Card da Solicitação Atual */}
        {!loadingRequest && currentRequest && (
          <Card className="mb-6 border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  Sua Solicitação Atual
                </CardTitle>
                {getStatusBadge(currentRequest.status)}
              </div>
              <CardDescription>
                Solicitada em{" "}
                {format(
                  new Date(currentRequest.created_at),
                  "dd/MM/yyyy 'às' HH:mm"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Órgão
                </p>
                <p className="text-base font-semibold">
                  {currentRequest.organization_name}
                  {currentRequest.organization_acronym &&
                    ` (${currentRequest.organization_acronym})`}
                </p>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Justificativa
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                  {currentRequest.justification}
                </p>
              </div>

              {currentRequest.status === "REJECTED" &&
                currentRequest.rejection_reason && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">
                        Motivo da Rejeição
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800">
                        {currentRequest.rejection_reason}
                      </p>
                    </div>
                  </>
                )}

              {currentRequest.reviewer_name && (
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  Analisada por: {currentRequest.reviewer_name}
                </div>
              )}

              {currentRequest.status === "PENDING" && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Sua solicitação está em análise. Você será notificado assim
                    que houver uma resposta.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Formulário de Nova Solicitação */}
        {(!currentRequest || currentRequest.status !== "PENDING") && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Dados da Solicitação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="organization_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Órgão *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={loading}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={loading ? "animate-pulse" : ""}
                            >
                              <SelectValue placeholder="Selecione o órgão" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {organizations.map((org) => (
                              <SelectItem key={org.id} value={org.id}>
                                {org.name}
                                {org.acronym && ` (${org.acronym})`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="justification"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Justificativa *</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Descreva o motivo da solicitação e como você utilizará o sistema..."
                            className="min-h-32"
                            maxLength={500}
                          />
                        </FormControl>
                        <div className="text-sm text-muted-foreground text-right">
                          {field.value?.length || 0}/500
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="min-w-32"
                    >
                      {submitting ? (
                        "Enviando..."
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Enviar Solicitação
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {currentRequest && currentRequest.status === "PENDING" && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Você já possui uma solicitação pendente.
              <br />
              Aguarde a análise antes de enviar uma nova solicitação.
            </p>
          </div>
        )}

        {(!currentRequest || currentRequest.status !== "PENDING") && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sua solicitação será analisada pela equipe do órgão selecionado.
              <br />O sistema identificará automaticamente seus dados
              cadastrais.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
