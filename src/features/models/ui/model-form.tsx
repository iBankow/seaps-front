import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RSCreatable } from "@/components/common/react-select";
import { Save, Trash } from "lucide-react";

import { useCreateModel, useUpdateModel } from "../api/models";
import { useItemsCatalog } from "../lib/use-items-catalog";
import type { Model, ModelItem } from "../types";

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
      }),
    )
    .min(1, {
      message: "Insira ao menos um Item",
    }),
});

type FormValues = z.infer<typeof formSchema>;

const filterDuplicateItems = (items: FormValues["items"]) => {
  const uniqueItems: FormValues["items"] = [];
  const itemNames = new Set<string>();

  items.forEach((item) => {
    if (!itemNames.has(item.name)) {
      itemNames.add(item.name);
      uniqueItems.push(item);
    }
  });

  return uniqueItems;
};

function ItemsFieldArray({
  form,
}: {
  form: ReturnType<typeof useForm<FormValues>>;
}) {
  const { items, handleCreate } = useItemsCatalog();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  return (
    <>
      <FormField
        control={form.control}
        name="items"
        render={() => (
          <FormItem>
            <FormLabel>Items</FormLabel>
            <div className="grid grid-cols-4 gap-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="relative w-full gap-4 rounded border border-dashed p-2"
                >
                  <FormField
                    control={form.control}
                    name={`items.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Nome do Item</FormLabel>
                        <RSCreatable
                          {...field}
                          placeholder="Selecione o item"
                          options={items}
                          onChange={(val: ModelItem | null) => {
                            field.onChange(val ? val.name : null);
                          }}
                          onCreateOption={(newValue: string) =>
                            handleCreate(newValue, field.onChange)
                          }
                          value={
                            items.find((item) => item.name === field.value) ||
                            null
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
              ))}
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
    </>
  );
}

export function CreateModelForm() {
  const router = useRouter();
  const { mutateAsync: createModel } = useCreateModel();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      items: [{ name: "" }],
    },
  });

  async function onSubmit(values: FormValues) {
    return createModel({
      ...values,
      name: values.name.toUpperCase(),
      description: values.description?.toUpperCase(),
      items: filterDuplicateItems(values.items).map((item) => ({
        name: item.name.toUpperCase(),
      })),
    })
      .then(() => router.navigate({ to: "/models" }))
      .catch((e) => console.log(e));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-xs font-bold tracking-widest uppercase">
              Informações do Modelo
            </CardTitle>
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

              <ItemsFieldArray form={form} />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.navigate({ to: "/models" })}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="font-heading uppercase text-xs leading-0"
              >
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

export function EditModelForm({ model }: { modelId: string; model: Model }) {
  const router = useRouter();
  const { mutateAsync: updateModel } = useUpdateModel(model.id);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: model.name,
      description: model.description || "",
      items: model.items?.map((item) => ({
        name: item?.name,
      })),
    },
  });

  async function onSubmit(values: FormValues) {
    return updateModel({
      ...values,
      name: values.name.toUpperCase(),
      description: values.description?.toUpperCase(),
      items: filterDuplicateItems(values.items).map((item) => ({
        name: item.name.toUpperCase(),
      })),
    })
      .then(() => router.history.back())
      .catch((e) => console.log(e));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-xs font-bold tracking-widest uppercase">
              Informações do Modelo
            </CardTitle>
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

              <ItemsFieldArray form={form} />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.history.back()}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="font-heading uppercase text-xs leading-0"
              >
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
