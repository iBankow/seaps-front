"use client";

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
import { Input } from "@/components/ui/input";
import { toUpperCase } from "@/lib/utils";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useRouter, useSearch } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from "lucide-react";

const formSchema = z.object({
  name: z
    .string({
      message: "Insira o nome do Responsável",
    })
    .min(1, { message: "Insira o nome do Responsável" }),
  role: z.string(),
  email: z.string().optional(),
  phone: z.string().optional(),
  organization_id: z.string({
    message: "Selecione o Orgão",
  }),
});

export function CreatePersonForm() {
  const params = useSearch({
    from: "/_auth/persons/create",
  });

  const router = useRouter();

  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organization_id: params.organization_id || "",
      name: "",
      phone: "",
      role: "",
      email: "",
    },
  });

  useEffect(() => {
    fetch("/api/organizations")
      .then((response) => response.json())
      .then((data) => setOrganizations(data));
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    return api
      .post("/api/v1/persons/", values)
      .then(() => {
        toast.success("Responsável criado com sucesso");
        router.history.back();
      })
      .finally(() => setLoading(false));
  }

  const formatPhone = (value: string) => {
    const str = value.replace(/\D/g, ""); // remove caracteres não numéricos

    return str.length <= 10
      ? str.replace(/(\d{2})(\d)/, "\($1\) $2").replace(/(\d{4})(\d)/, "$1-$2")
      : str
          .replace(/(\d{2})(\d)/, "\($1\) $2")
          .replace(/(\d{1})(\d{4})(\d)/, "$1 $2-$3")
          .slice(0, 16);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Informações do Imóvel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="organization_id"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Orgão</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={params.organization_id || undefined}
                  >
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
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Nome</FormLabel>
                  <Input
                    {...field}
                    onBlur={(e) => field.onChange(toUpperCase(e))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Cargo</FormLabel>
                  <Input
                    {...field}
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
                  <FormLabel>E-mail</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Telefone</FormLabel>
                  <Input
                    {...field}
                    onChange={(e) => {
                      e.target.value = formatPhone(e.target.value);
                      field.onChange(e);
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.history.back()}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Criando..." : "Criar Responsável"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
