import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Save } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  model_id: z.string({
    message: "Selecione um modelo de checklist",
  }),
  organization_id: z.string({
    message: "Selecione o Orgão",
  }),
  property_id: z.string({
    message: "Selecione o Imóvel",
  }),
  user_id: z.string({
    message: "Selecione o Responsável pelo Checklist",
  }),
  is_returned: z.boolean({
    message: "Selecione se o checklist é de retorno",
  }),
  return: z.number().optional(),
});

export function CreateCheckListForm({ checklist }: { checklist?: any }) {
  const router = useRouter();

  const [organizations, setOrganizations] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organization_id: undefined as unknown as string,
    },
  });
  const [organization_id] = form.watch(["organization_id"]);

  useEffect(() => {
    const getData = async () => {
      const [models, organizations, users] = await Promise.all([
        api.get("/api/v1/models?per_page=100"),
        api.get("/api/organizations"),
        api.get("/api/v1/users?per_page=100&role=evaluator"),
      ]);

      setModels(models.data.data);
      setOrganizations(organizations.data);
      setUsers(users.data.data);

      if (checklist) {
        form.reset(checklist);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    if (organization_id) {
      api
        .get(
          "/api/v1/properties?organization_id=" +
            organization_id +
            "&per_page=1000"
        )
        .then(({ data }) => setProperties(data.data));
    }
  }, [organization_id]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (checklist) {
      return api
        .put("/api/v1/checklists/" + checklist.id, {
          user_id: values.user_id,
        })
        .then(() =>
          router.navigate({
            to: "/checklists",
          })
        )
        .catch((e) => console.log(e));
    }

    return api
      .post("/api/v1/checklists/", values)
      .then(() =>
        router.navigate({
          to: "..",
          search: {
            refresh: Date.now(),
          },
        })
      )
      .catch((e) => console.log(e));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Informações do Checklist</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                disabled={!!checklist}
                name="model_id"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Modelo</FormLabel>
                    <Select onValueChange={field.onChange} {...field}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o Modelo do checklist" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {models?.map((item) => (
                          <SelectItem key={item.id} value={String(item.id)}>
                            {item.name}
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
                disabled={!!checklist}
                name="organization_id"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Orgão</FormLabel>
                    <Select onValueChange={field.onChange} {...field}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o Orgão" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {organizations.map((item) => (
                          <SelectItem key={item.id} value={String(item.id)}>
                            {item.name}
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
                disabled={!!checklist}
                name="property_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imóvel</FormLabel>
                    <div className="flex w-full items-center gap-2">
                      <Select
                        onValueChange={field.onChange}
                        disabled={!form.getValues("organization_id")}
                        {...field}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o imóvel do Orgão" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {properties.map((item) => (
                            <SelectItem key={item.id} value={String(item.id)}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        disabled={!form.getValues("organization_id")}
                        variant={"default"}
                        onClick={() => {
                          router.navigate({
                            to: `/properties/create?organization_id=${form.getValues("organization_id")}`,
                          });
                        }}
                        size="icon"
                      >
                        <Plus />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="user_id"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Responsável pelo Checklist</FormLabel>
                    <Select onValueChange={field.onChange} {...field}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o Responsável pelo checklis" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users.map((item) => (
                          <SelectItem key={item.id} value={String(item.id)}>
                            {item.name}
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
                disabled={!!checklist}
                name="is_returned"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel>Checklist de Retorno?</FormLabel>
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        disabled={!!checklist}
                        variant={field.value ? "default" : "outline"}
                        onClick={() => field.onChange(true)}
                      >
                        Sim
                      </Button>
                      <Button
                        type="button"
                        disabled={!!checklist}
                        variant={field.value === false ? "default" : "outline"}
                        onClick={() => field.onChange(false)}
                      >
                        Não
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                disabled={!!checklist}
                name="return"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Qual retorno?</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        disabled={!form.watch("is_returned")}
                        placeholder="Informe o número do checklist de retorno"
                        className="input input-bordered w-full"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.navigate({ to: "/properties" })}
              >
                Cancelar
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                {false
                  ? "Criando..."
                  : checklist
                    ? "Salvar Checklist"
                    : "Criar Checklist"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
