import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

import { useEffect } from "react";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { useRouter, useSearch } from "@tanstack/react-router";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { useOrganizationsList } from "@/features/organizations";

const filterSchema = z.object({
  organization: z.string().optional(),
  status: z.string().optional(),
  user_name: z.string().optional(),
});

export function RequestsFilterForm() {
  const searchParams = useSearch({ from: "/_auth/users/" });
  const router = useRouter();

  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      organization: searchParams.organization || "",
      status: searchParams.status || "",
      user_name: searchParams.user_name || "",
    },
  });

  const handleClearSearch = () => {
    form.reset({
      organization: "",
      status: "",
      user_name: "",
    });

    router.navigate({
      to: "/users",
      search: {
        page: 1,
        per_page: searchParams.per_page || 10,
        tab: "requests",
      },
      replace: true,
    });
  };

  useEffect(() => {
    form.reset({
      organization: searchParams.organization || "",
      status: searchParams.status || "",
      user_name: searchParams.user_name || "",
    });
  }, [searchParams, form]);

  async function onSubmit(values: z.infer<typeof filterSchema>) {
    const newSearchParams: any = {
      page: 1,
      per_page: searchParams.per_page || 10,
      tab: "requests",
    };

    if (values.organization) {
      newSearchParams.organization = values.organization;
    }

    if (values.status) {
      if (values.status === "all") {
        newSearchParams.status = undefined; // Remove o filtro de status para mostrar todos
      } else {
        newSearchParams.status = values.status;
      }
    }

    if (values.user_name) {
      newSearchParams.user_name = values.user_name;
    }

    await router.navigate({
      to: "/users",
      search: newSearchParams,
      replace: true,
    });
  }

  const { data: organizations } = useOrganizationsList();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="user_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Usuário</FormLabel>
                <FormControl>
                  <Input placeholder="Nome" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="PENDING">Pendente</SelectItem>
                    <SelectItem value="APPROVED">Aprovado</SelectItem>
                    <SelectItem value="REJECTED">Rejeitado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Controller
            name="organization"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor="form-rhf-select-organization">
                    Organização
                  </FieldLabel>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                >
                  <SelectTrigger
                    id="form-rhf-select-organization"
                    aria-invalid={fieldState.invalid}
                    className="min-w-30"
                  >
                    <SelectValue placeholder="Selecione o órgão" />
                  </SelectTrigger>
                  <SelectContent position="item-aligned">
                    {organizations?.data?.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />

          <div className="flex items-end gap-2 self-end justify-self-end">
            <Button type="submit">Filtrar</Button>
            <Button type="button" variant="outline" onClick={handleClearSearch}>
              Limpar
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
