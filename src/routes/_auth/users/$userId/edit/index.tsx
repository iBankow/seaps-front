import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_auth/users/$userId/edit/")({
  component: EditUser,
});

const userSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(255, "Nome muito longo"),
  email: z.email("Email inválido").min(1, "Email é obrigatório"),
  permissions: z.array(z.string()).optional(),
  is_active: z.boolean(),
  role: z.string(),
});

type UserFormData = z.infer<typeof userSchema>;

const features = [
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
    label: "Editar Checklists"
  },
  {
    name: "checklists:delete",
    label: "Deletar Checklists"
  },
  {
    name: "checklist_items:edit_all",
    label: "Editar Itens de todos os Checklist"
  },
  {
    name: "properties:create",
    label: "Criar Imóveis"
  },
  {
    name: "properties:edit",
    label: "Editar Imóveis"
  },
  {
    name: "properties:delete",
    label: "Deletar Imóveis"
  },
  {
    name: "users:edit_configs",
    label: "Editar Configurações de Usuários"
  },
];

function EditUser() {
  const { userId } = Route.useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserFormData | null>(null);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "USER",
      is_active: false,
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data } = await api.get(`/api/v1/users/${userId}`);
        if (data) {
          form.reset({
            name: data.name,
            email: data.email,
            is_active: data.is_active,
            role: data.role,
            permissions: data.permissions || [],
          });
          setUser(data)
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
        role: values.role,
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
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`..`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="h-6 w-48 animate-pulse rounded bg-gray-200"></div>
        </div>
        <Card>
          <CardHeader>
            <div className="h-6 w-32 animate-pulse rounded bg-gray-200"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-10 w-full animate-pulse rounded bg-gray-200"></div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to={`..`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Editar Usuário</h1>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto w-full max-w-3xl space-y-3"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input disabled {...field} />
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input disabled {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Configurações</FormLabel>
            <FormItem>
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Ativação do usuário</FormLabel>
                      <FormDescription>
                        Quando ativo, o usuário terá acesso básico ao sistema.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500 dark:data-[state=unchecked]:bg-red-500"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-readonly
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </FormItem>

            <FormItem>
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between gap-4 rounded-lg border p-3 shadow-sm">
                    <div className="w-1/2 space-y-0.5">
                      <FormLabel>Perfil de Acesso</FormLabel>
                      <FormDescription>
                        ADMINISTRADOR: Responsável pela gestão geral do sistema.
                      </FormDescription>
                      <FormDescription>
                        SUPERVISOR: Responsável por gerenciar os dados
                        principais.
                      </FormDescription>
                      <FormDescription>
                        AVALIADOR: Responsável por executar os checklists.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={user?.role}
                      >
                        <FormControl>
                          <SelectTrigger className="w-1/2">
                            <SelectValue placeholder="Selecione o Perfil de acesso" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            { id: "ADMIN", name: "ADMINISTRADOR" },
                            { id: "EVALUATOR", name: "AVALIADOR" },
                            { id: "SUPERVISOR", name: "SUPERVISOR" },
                          ].map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </FormItem>
          </FormItem>
          <FormItem>
            <FormLabel>Funcionalidades</FormLabel>
            <FormField
              control={form.control}
              name="permissions"
              render={({ field }) => {
                const isAllSelected = field.value?.includes("*");
                return (
                  <div className="flex flex-col gap-2">
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel className="mb-0">Acesso como administrador</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={isAllSelected}
                          defaultChecked={field.value?.includes("*")}
                          onCheckedChange={(checked) => {
                            let newFeatures = field.value || [];
                            if (checked) {
                              newFeatures = [...newFeatures, '*'];
                            } else {
                              newFeatures = newFeatures.filter((f) => f !== '*');
                            }
                            field.onChange(newFeatures);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel className="mb-0">Acesso como avaliador</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          defaultChecked={field.value?.includes("evaluator")}
                          onCheckedChange={(checked) => {
                            let newFeatures = field.value || [];
                            if (checked) {
                              newFeatures = [...newFeatures, 'evaluator'];
                            } else {
                              newFeatures = newFeatures.filter((f) => f !== 'evaluator');
                            }
                            field.onChange(newFeatures);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                    {features.map((feature) => {
                      const isChecked = field.value?.includes(feature.name);
                      return (
                        <FormItem
                          key={feature.name}
                          className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"
                        >
                          <div className="space-y-0.5">
                            <FormLabel className="mb-0">{feature.label}</FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={isChecked || isAllSelected}
                              disabled={isAllSelected}
                              onCheckedChange={(checked) => {
                                let newFeatures = field.value?.filter((f) => f !== "*") || [];
                                if (checked) {
                                  newFeatures = [...newFeatures, feature.name];
                                } else {
                                  newFeatures = newFeatures.filter((f) => f !== feature.name);
                                }
                                field.onChange(newFeatures);
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      );
                    })}
                  </div>
                );
              }}
            />
          </FormItem>
          <div className="flex justify-end">
            <Button type="submit" className="self-end">
              Salvar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
