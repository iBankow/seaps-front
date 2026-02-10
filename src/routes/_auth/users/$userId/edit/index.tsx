import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ArrowLeft,
  Shield,
  Building2,
  CheckCircle2,
  ListChecks,
  Home,
  Users,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { RSSelect } from "@/components/react-select";

export const Route = createFileRoute("/_auth/users/$userId/edit/")({
  component: EditUser,
  loader: () => ({
    crumb: "Editar",
  }),
});

const userSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(255, "Nome muito longo"),
  email: z.email("Email inválido").min(1, "Email é obrigatório"),
  organization_id: z.string().optional(),
  permissions: z.array(z.string()).optional(),
  is_active: z.boolean(),
});

type UserFormData = z.infer<typeof userSchema>;

const permissionGroups = [
  {
    title: "Checklists",
    icon: ListChecks,
    description: "Gerenciamento de checklists",
    permissions: [
      {
        name: "checklists:view_all",
        label: "Visualizar todos Checklists",
      },
      {
        name: "checklists:create",
        label: "Criar Checklists",
      },
      {
        name: "checklists:edit",
        label: "Editar Checklists",
      },
      {
        name: "checklists:delete",
        label: "Deletar Checklists",
      },
      {
        name: "checklist_items:edit_all",
        label: "Editar Itens de todos os Checklist",
      },
    ],
  },
  {
    title: "Imóveis",
    icon: Home,
    description: "Gerenciamento de propriedades",
    permissions: [
      {
        name: "properties:create",
        label: "Criar Imóveis",
      },
      {
        name: "properties:edit",
        label: "Editar Imóveis",
      },
      {
        name: "properties:delete",
        label: "Deletar Imóveis",
      },
    ],
  },
  {
    title: "Usuários",
    icon: Users,
    description: "Gerenciamento de usuários",
    permissions: [
      {
        name: "users:edit_configs",
        label: "Editar Configurações de Usuários",
      },
    ],
  },
];

function EditUser() {
  const { userId } = Route.useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [organizations, setOrganizations] = useState<
    { id: string; name: string }[]
  >([]);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      is_active: false,
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data } = await api.get(`/api/v1/users/${userId}`);
        const orgsResponse = await api.get(`/api/v1/organizations?per_page=100`);
        setOrganizations(orgsResponse.data.data);
        if (data) {
          form.reset({
            name: data.name,
            email: data.email,
            is_active: data.is_active,
            permissions: data.permissions || [],
            organization_id: data.organization.id || null,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId, form]);

  const onSubmit = async (values: UserFormData) => {
    api
      .put(`/api/v1/users/${userId}`, {
        permissions: values.permissions,
        is_active: values.is_active,
        organization_id: values.organization_id,
      })
      .then(() => {
        toast.success("Usuário atualizado com sucesso!");
        router.navigate({ to: `/users/${userId}` });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`..`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="space-y-2 flex-1">
            <div className="h-8 w-64 animate-pulse rounded bg-muted"></div>
            <div className="h-4 w-48 animate-pulse rounded bg-muted"></div>
          </div>
        </div>

        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <div className="h-6 w-48 animate-pulse rounded bg-muted"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div
                      key={j}
                      className="h-16 w-full animate-pulse rounded bg-muted"
                    ></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to={`..`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Usuário</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure as permissões e o status do usuário
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Informações Básicas */}
          <Card className="overflow-hidden">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-primary" />
                Informações Básicas
              </CardTitle>
              <CardDescription>
                Dados cadastrais do usuário (não editáveis)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input disabled {...field} className="bg-muted/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input disabled {...field} className="bg-muted/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Status do Usuário */}
          <Card className="overflow-hidden">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Status da Conta
              </CardTitle>
              <CardDescription>
                Controle o acesso do usuário ao sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-semibold">
                          Ativação do usuário
                        </FormLabel>
                        <FormDescription>
                          Quando ativo, o usuário terá acesso básico ao sistema
                          conforme suas permissões.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="organization_id"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-semibold">
                          Orgão do usuário
                        </FormLabel>
                        <FormDescription>
                          Selecione o órgão ao qual o usuário pertence.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <RSSelect
                          placeholder="Selecione o Orgão"
                          className="min-w-60"
                          options={organizations}
                          onChange={(val) => {
                            field.onChange(val ? val.id : null);
                          }}
                          value={
                            organizations.find(
                              (organization) => organization.id === field.value,
                            ) || null
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Níveis de Acesso */}
          <Card className="overflow-hidden">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-primary" />
                Níveis de Acesso
              </CardTitle>
              <CardDescription>
                Defina o nível de acesso do usuário no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="permissions"
                render={({ field }) => {
                  const isAdmin = field.value?.includes("*");
                  const isOrgAdmin = field.value?.includes("organization:*");
                  const isEvaluator = field.value?.includes("evaluator");
                  const hasFullAccess = isAdmin || isOrgAdmin;

                  return (
                    <div className="space-y-3">
                      {/* Administrador Total */}
                      <div className="flex flex-row items-center justify-between rounded-lg border-2 border-primary/20 bg-primary/5 p-4 shadow-sm">
                        <div className="space-y-0.5 flex-1">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-primary" />
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
                            <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
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
                            Acesso total aos recursos da própria organização do
                            usuário, incluindo todas as permissões específicas.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={isOrgAdmin || isAdmin}
                            disabled={isAdmin}
                            onCheckedChange={(checked) => {
                              let newPermissions =
                                field.value?.filter((f) => f !== "*") || [];
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
                              field.value?.includes("checklist:validate") ||
                              hasFullAccess
                            }
                            disabled={hasFullAccess}
                            onCheckedChange={(checked) => {
                              let newPermissions =
                                field.value?.filter(
                                  (f) => f !== "*" && f !== "organization:*",
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
                                  (f) => f !== "*" && f !== "organization:*",
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
          </Card>

          {/* Permissões Específicas */}
          <Card className="overflow-hidden">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ListChecks className="h-5 w-5 text-primary" />
                Permissões Específicas
              </CardTitle>
              <CardDescription>
                Configure permissões granulares por funcionalidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="permissions"
                render={({ field }) => {
                  const isAdmin = field.value?.includes("*");
                  const isOrgAdmin = field.value?.includes("organization:*");
                  const hasFullAccess = isAdmin || isOrgAdmin;

                  return (
                    <div className="space-y-6">
                      {hasFullAccess && (
                        <div className="rounded-lg bg-primary/10 border-2 border-primary/30 p-4 text-center">
                          <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
                          <p className="font-semibold text-sm">
                            Todas as permissões estão habilitadas
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {isAdmin
                              ? "O usuário possui acesso total como Administrador"
                              : "O usuário possui acesso total à sua organização"}
                          </p>
                        </div>
                      )}

                      {permissionGroups.map((group) => {
                        const GroupIcon = group.icon;
                        return (
                          <div key={group.title} className="space-y-3">
                            <div className="flex items-center gap-2 pb-2">
                              <GroupIcon className="h-5 w-5 text-primary" />
                              <div>
                                <h3 className="font-semibold text-base">
                                  {group.title}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                  {group.description}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-2 pl-7">
                              {group.permissions.map((permission) => {
                                const isChecked = field.value?.includes(
                                  permission.name,
                                );
                                return (
                                  <div
                                    key={permission.name}
                                    className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm hover:bg-muted/50 transition-colors"
                                  >
                                    <FormLabel className="mb-0 text-sm font-normal cursor-pointer flex-1">
                                      {permission.label}
                                    </FormLabel>
                                    <FormControl>
                                      <Switch
                                        checked={isChecked || hasFullAccess}
                                        disabled={hasFullAccess}
                                        onCheckedChange={(checked) => {
                                          let newPermissions =
                                            field.value?.filter(
                                              (f) =>
                                                f !== "*" &&
                                                f !== "organization:*",
                                            ) || [];
                                          if (checked) {
                                            newPermissions = [
                                              ...newPermissions,
                                              permission.name,
                                            ];
                                          } else {
                                            newPermissions =
                                              newPermissions.filter(
                                                (f) => f !== permission.name,
                                              );
                                          }
                                          field.onChange(newPermissions);
                                        }}
                                      />
                                    </FormControl>
                                  </div>
                                );
                              })}
                            </div>
                            {group !==
                              permissionGroups[permissionGroups.length - 1] && (
                              <Separator className="mt-4" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                }}
              />
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" asChild>
              <Link to={`..`}>Cancelar</Link>
            </Button>
            <Button type="submit" size="lg" className="min-w-32">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
