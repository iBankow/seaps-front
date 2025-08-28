"use client";

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

import { toUpperCase } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearch } from "@tanstack/react-router";

const filterSchema = z.object({
  organization: z.string().optional(),
  role: z.string().optional(),
  name: z.string().optional(),
  email: z.string().optional(),
});

export function DataFilterForm() {
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4"
      >
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Função</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || undefined}
              >
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a Função" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ADMIN">ADMINISTRADOR</SelectItem>
                  <SelectItem value="MANAGER">GERENTE</SelectItem>
                  <SelectItem value="EVALUATOR">AVALIADOR</SelectItem>
                  <SelectItem value="USER">USUÁRIO</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Nome do Usuário</FormLabel>
              <Input
                {...field}
                placeholder="Insira o nome do usuário"
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
              <FormLabel>Email</FormLabel>
              <Input {...field} placeholder="Insira o email" type="email" />
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-x-2 self-end justify-self-end">
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
        <Input placeholder="Insira o nome do usuário" />
      </div>
      <div className="w-full space-y-2">
        <Label>Email</Label>
        <Input placeholder="Insira o email" />
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
