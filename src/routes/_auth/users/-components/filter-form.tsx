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
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";

import { toUpperCase } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearch } from "@tanstack/react-router";
import { api } from "@/lib/api";

const filterSchema = z.object({
  organization: z.string().optional(),
  role: z.string().optional(),
  name: z.string().optional(),
  email: z.string().optional(),
});

export function DataFilterForm() {
  const [organizations, setOrganizations] = useState<any[]>([]);

  const searchParams = useSearch({ from: "/_auth/users/" });
  const router = useRouter();

  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      organization: searchParams.organization || "",
      name: searchParams.name || "",
      email: searchParams.email || "",
    },
  });

  const handleClearSearch = () => {
    form.reset({
      organization: "",
      role: "",
      name: "",
      email: "",
    });

    router.navigate({
      to: "/users",
      search: {
        page: 1,
        per_page: searchParams.per_page || 10,
      },
      replace: true,
    });
  };

  // Reset form when search params change
  useEffect(() => {
    form.reset({
      organization: searchParams.organization || "",
      role: searchParams.role || "",
      name: searchParams.name || "",
      email: searchParams.email || "",
    });
  }, [searchParams, form]);

  async function onSubmit(values: z.infer<typeof filterSchema>) {
    const newSearchParams: any = {
      page: 1,
      per_page: searchParams.per_page || 10,
    };

    // Add filter values to search params
    Object.entries(values).forEach(([key, value]) => {
      if (value && value !== "") {
        newSearchParams[key] = value;
      }
    });

    router.navigate({
      to: "/users",
      search: newSearchParams,
      replace: true,
    });
  }

  useEffect(() => {
    api
      .get("/api/v1/organizations?per_page=100")
      .then(({ data }) => setOrganizations(data.data));
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col sm:flex-row gap-4 items-end justify-end"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <Input
                {...field}
                placeholder="Busque por nome do usuário"
                onBlur={(e) => field.onChange(toUpperCase(e))}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <Input {...field} placeholder="Busque por email" type="email" />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="organization"
          render={({ field }) => (
            <FormItem className="w-full">
              <Select
                onValueChange={field.onChange}
                value={field.value || undefined}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filtrar por Orgão" />
                </SelectTrigger>
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
        <div className="space-x-2 self-end justify-self-end flex-nowrap flex">
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
        <Label>Função</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a Função" />
          </SelectTrigger>
          <SelectContent></SelectContent>
        </Select>
      </div>
      <div className="w-full space-y-2">
        <Label>Nome do Usuário</Label>
        <Input placeholder="Busque por nome do usuário" />
      </div>
      <div className="w-full space-y-2">
        <Label>Email</Label>
        <Input placeholder="Busque por email" />
      </div>
      <div className="w-full space-y-2">
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
