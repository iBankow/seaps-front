import { z } from "zod";
import { useForm } from "react-hook-form";
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
      newSearchParams.status = values.status;
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
                  <Input placeholder="Nome..." {...field} />
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
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value=" ">Todos</SelectItem>
                    <SelectItem value="PENDING">Pendente</SelectItem>
                    <SelectItem value="APPROVED">Aprovado</SelectItem>
                    <SelectItem value="REJECTED">Rejeitado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="organization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organização</FormLabel>
                <FormControl>
                  <Input placeholder="Organização..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-end gap-2">
            <Button type="submit" className="flex-1">
              Filtrar
            </Button>
            <Button type="button" variant="outline" onClick={handleClearSearch}>
              Limpar
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
