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
import { useRouter } from "@tanstack/react-router";
import { api } from "@/lib/api";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";

const formSchema = z.object({
  user_id: z.string({
    message: "Selecione o Responsável pelo Checklist",
  }),
  is_returned: z.boolean({
    message: "Selecione se o checklist é de retorno",
  }),
  return: z.number().optional(),
});

export function EditCheckListForm({ checklist }: { checklist?: any }) {
  const router = useRouter();

  const [models, setModels] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: checklist ?? {
      user_id: "",
      return: 0,
      is_returned: false,
    },
  });

  useEffect(() => {
    if (checklist) {
      form.reset(checklist);
    }

    const getData = async () => {
      const [models, users] = await Promise.all([
        api.get("/models?per_page=100"),
        api.get("/users?per_page=100&role=evaluator"),
      ]);

      setModels(models.data.data);
      setUsers(users.data.data);
    };
    getData();
  }, [checklist]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (checklist) {
      return api
        .put("/checklists/" + checklist.id, {
          user_id: values.user_id,
          is_returned: values.is_returned,
          return: values.is_returned ? Number(values.return) : undefined,
        })
        .then(() =>
          router.navigate({
            to: "..",
            replace: true,
          }),
        )
        .catch((e) => console.log(e));
    }
  }

  return (
    <Form {...form}>
      <form className="max-w-2xl w-full" onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <FormItem className="w-full">
                <FormLabel>Modelo</FormLabel>
                <Input
                  disabled
                  value={
                    models.find((model) => model.id === checklist.model_id)
                      ?.name || ""
                  }
                  className="input input-bordered w-full"
                />
                <FormMessage />
              </FormItem>

              <FormItem className="w-full">
                <FormLabel>Orgão</FormLabel>
                <Input
                  disabled
                  value={checklist?.organization.name || ""}
                  className="input input-bordered w-full"
                />
                <FormMessage />
              </FormItem>

              <FormItem className="w-full">
                <FormLabel>Imóvel</FormLabel>
                <Input
                  disabled
                  value={checklist?.property.name || ""}
                  className="input input-bordered w-full"
                />
                <FormMessage />
              </FormItem>

              <FormField
                control={form.control}
                name="user_id"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Responsável pelo Checklist</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o Responsável pelo checklist" />
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
                name="is_returned"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel>É um Checklist de Retorno?</FormLabel>

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant={
                          field.value === undefined
                            ? "outline"
                            : field.value === true
                              ? "default"
                              : "outline"
                        }
                        onClick={() => field.onChange(true)}
                      >
                        Sim
                      </Button>
                      <Button
                        type="button"
                        variant={
                          field.value === undefined
                            ? "outline"
                            : field.value === false
                              ? "default"
                              : "outline"
                        }
                        onClick={() => field.onChange(false)}
                      >
                        Não
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("is_returned") && (
                <FormField
                  control={form.control}
                  name="return"
                  defaultValue={1}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Qual retorno?</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="Informe o número do checklist de retorno"
                          className="input input-bordered w-full"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </CardContent>
          <CardFooter className="gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.navigate({ to: "..", replace: true })}
            >
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Salvar Checklist
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
