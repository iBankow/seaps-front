"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
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

import { getFirstAndLastName, toUpperCase } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { RSSelect } from "@/components/react-select";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { useRouter, useSearch } from "@tanstack/react-router";

const filterSchema = z.object({
  organization_id: z.string().optional(),
  user_id: z.string().optional().nullable(),
  status: z.string().optional(),
  property_name: z.string().optional(),
});

export function DataFilterForm() {
  const searchParams = useSearch({ from: "/_auth/checklists/" });
  const router = useRouter();

  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      organization_id: searchParams.organization_id || "",
      property_name: searchParams.property_name || "",
      user_id: searchParams.user_id || "",
      status: searchParams.status || "",
    },
  });

  const [organizations, setOrganizations] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleClearSearch = () => {
    form.reset({
      organization_id: "",
      user_id: "",
      status: "",
      property_name: "",
    });

    router.navigate({
      to: "/checklists",
      search: {
        page: 1,
        per_page: searchParams.per_page || 10,
      },
    });
  };

  useEffect(() => {
    try {
      api
        .get("/api/v1/organizations?per_page=100")
        .then(({ data }) => setOrganizations(data.data));
      api.get("/api/v1/users?role=evaluator").then(({ data }) =>
        setUsers(
          data.data.map((user: any) => ({
            ...user,
            name: getFirstAndLastName(user.name),
          }))
        )
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    form.reset({
      organization_id: searchParams.organization_id || "",
      property_name: searchParams.property_name || "",
      user_id: searchParams.user_id || "",
      status: searchParams.status || "",
    });
  }, [searchParams, form]);

  async function onSubmit(values: z.infer<typeof filterSchema>) {
    const newSearchParams: any = {
      page: 1,
      per_page: searchParams.per_page || 10,
    };

    Object.entries(values).forEach(([key, value]) => {
      if (value && value !== "") {
        newSearchParams[key] = value;
      }
    });

    router.navigate({
      to: "/checklists",
      search: newSearchParams,
    });
  }

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4"
      >
        <FormField
          control={form.control}
          name="organization_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Orgão</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || undefined}
              >
                <FormControl className="w-full">
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
          name="property_name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Nome do Imóvel</FormLabel>
              <Input
                {...field}
                placeholder="Insira o nome do Imóvel"
                onBlur={(e) => field.onChange(toUpperCase(e))}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="user_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsável</FormLabel>
              <RSSelect
                {...field}
                placeholder="Selecione o Responsável"
                options={users}
                onChange={(val) => {
                  field.onChange(val ? val.id : null);
                }}
                value={users.find((user) => user.id === field.value) || null}
              />
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
                value={field.value || undefined}
              >
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o Status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="OPEN">ABERTO</SelectItem>
                  <SelectItem value="CLOSED">FECHADO</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="col-span-full space-x-2 self-end justify-self-end">
          <Button type="submit">Filtrar</Button>
          <Button
            variant="ghost"
            type="button"
            onClick={handleClearSearch}
            className="px-2 lg:px-3"
          >
            Limpar
          </Button>
        </div>
      </form>
    </Form>
  );
}

export const LoadingSkeleton = () => {
  return (
    <div className="grid animate-pulse grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
      <div className="w-full space-y-2">
        <Label>Orgão</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o Orgão" />
          </SelectTrigger>
          <SelectContent></SelectContent>
        </Select>
      </div>
      <div className="w-full space-y-2">
        <Label>Nome do Imóvel</Label>
        <Input placeholder="Insira o nome do Imóvel" />
      </div>
      <div className="w-full space-y-2">
        <Label>Responsável</Label>
        <RSSelect placeholder="Selecione o Responsável" options={[]} />
      </div>
      <div className="w-full space-y-2">
        <Label>Status</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o Status" />
          </SelectTrigger>
        </Select>
      </div>
      <div className="col-span-full space-x-2 self-end justify-self-end">
        <Button type="submit" disabled>
          Filtrar
        </Button>
        <Button variant="ghost" type="button" className="px-2 lg:px-3" disabled>
          Limpar
        </Button>
      </div>
    </div>
  );
};
