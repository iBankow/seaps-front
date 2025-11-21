import { createFileRoute } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Building, UserPlus, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { api } from "@/lib/api";

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

export const Route = createFileRoute("/request")({
  component: RouteComponent,
});

function RouteComponent() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<RequestFormData>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      organization_id: "",
      justification: "",
    },
  });

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

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sua solicitação será analisada pela equipe do órgão selecionado.
            <br />O sistema identificará automaticamente seus dados cadastrais.
          </p>
        </div>
      </div>
    </div>
  );
}
