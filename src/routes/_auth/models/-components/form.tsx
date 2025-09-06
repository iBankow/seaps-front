import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RSCreatable } from "@/components/react-select";
import { useRouter } from "@tanstack/react-router";

const formSchema = z.object({
  name: z
    .string({
      message: "Insira o nome do Modelo",
    })
    .min(1, { message: "Insira o nome do Item" }),
  description: z.string().optional(),
  items: z
    .array(
      z.object({
        name: z
          .string({ message: "Insira o nome do Item" })
          .min(1, { message: "Insira o nome do Item" }),
      })
    )
    .min(1, {
      message: "Insira ao menos um Item",
    }),
});

export function EditModelForm({
  model,
}: {
  modelId: string;
  model: any & {
    modelItems: ({
      item: {
        name: string;
      };
    } & {
      id: string;
      created_at: Date;
      item_id: string;
      order: number;
      model_id: string;
    })[];
  };
}) {
  const router = useRouter();

  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    api.get("/api/v1/items").then(({ data }) => setItems(data));
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: model.name,
      description: model.description || "",
      items: model.items.map((item: any) => ({
        name: item?.name,
      })),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    return api
      .put("/api/v1/models/" + model.id, {
        ...values,
        items: values.items.map((item) => ({
          name: item.name.toUpperCase(),
        })),
      })
      .then(() =>
        router.navigate({
          to: "/models",
        })
      )
      .catch((e) => console.log(e));
  }

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const handleCreate = (
    inputValue: string,
    onChange: (value: string) => void
  ) => {
    setItems((prev) => [
      ...prev,
      { id: Date.now().toString(), name: inputValue.toUpperCase() },
    ]);

    return onChange(inputValue.toUpperCase());
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Informações do Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-col">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo</FormLabel>
                    <Input {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <Textarea {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="items"
                render={({}) => (
                  <FormItem>
                    <FormLabel>Items</FormLabel>
                    <div className="grid grid-cols-4 gap-4">
                      {fields.map((field, index) => {
                        return (
                          <div
                            key={index}
                            className="relative w-full gap-4 rounded border border-dashed p-2"
                          >
                            <FormField
                              control={form.control}
                              key={field.id}
                              name={`items.${index}.name`}
                              render={({ field }) => (
                                <FormItem className="w-full">
                                  <FormLabel>Nome do Item</FormLabel>
                                  <RSCreatable
                                    {...field}
                                    placeholder="Selecione o item"
                                    options={items}
                                    onChange={(val) => {
                                      field.onChange(val ? val.name : null);
                                    }}
                                    onCreateOption={(newValue: string) =>
                                      handleCreate(newValue, field.onChange)
                                    }
                                    value={
                                      items.find(
                                        (item) => item.name === field.value
                                      ) || null
                                    }
                                  />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              size="icon"
                              type="button"
                              className="absolute -right-5 -top-5 h-8 w-8 rounded-full"
                              onClick={() => {
                                form.clearErrors();
                                remove(index);
                              }}
                              variant="destructive"
                            >
                              <Trash width={16} />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="outline"
                className="col-span-2 w-full border-dashed"
                onClick={() => append({ name: "" })}
              >
                Adicionar Item
              </Button>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                // onClick={() => router.navigate({ to: "/properties" })}
              >
                Cancelar
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Salvar Modelo
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
