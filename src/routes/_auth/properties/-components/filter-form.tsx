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

import { toUpperCase } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { RSSelect } from "@/components/react-select";
import axios from "axios";

const filterSchema = z.object({
  organization_id: z.string().optional(),
  type: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  name: z.string().optional(),
});

export function DataFilterForm() {
  const search = useSearch({ from: "/_auth/properties/" });
  const navigate = useNavigate({ from: "/properties" });

  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
  });

  const [organizations, setOrganizations] = useState<any[]>([]);
  const [cities, setCities] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const handleClearSearch = () => {
    form.reset({
      city: undefined,
      name: "",
      organization_id: "",
      type: "",
      state: "",
    });

    navigate({
      search: {
        page: 1,
        per_page: search.per_page || 10,
      },
      replace: true,
    });
  };

  useEffect(() => {
    try {
      api
        .get("/api/v1/organizations?per_page=100")
        .then(({ data }) => setOrganizations(data.data));
      axios
        .get(
          `https://brasilapi.com.br/api/ibge/municipios/v1/MT?providers=dados-abertos-br,gov,wikipedia`
        )
        .then(({ data }) => {
          setCities(
            data.map((city: { nome: string; codigo_ibge: string }) => ({
              id: city.nome.replace(/\s*\(.*?\)/g, ""),
              name: city.nome.replace(/\s*\(.*?\)/g, ""),
            }))
          );
        });

      setCities([]);
    } catch (err) {
      console.error("Error fetching filter data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    form.reset({
      organization_id: search.organization_id || "",
      type: search.type || "",
      city: search.city || undefined,
      state: search.state || "",
      name: search.name || "",
    });
  }, [search, form]);

  function onSubmit(values: z.infer<typeof filterSchema>) {
    navigate({
      search: {
        name: values.name || undefined,
        organization_id: values.organization_id || undefined,
        type: values.type || undefined,
        city: values.city || undefined,
      },
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || undefined}
              >
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o Tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="OWN">PRÓPRIO</SelectItem>
                  <SelectItem value="RENTED">ALUGADO</SelectItem>
                  <SelectItem value="GRANT">CONCESSÃO</SelectItem>
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
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade</FormLabel>
              <FormControl>
                <RSSelect
                  {...field}
                  placeholder="Selecione a Cidade Imóvel"
                  options={cities}
                  onChange={(val) => {
                    field.onChange(val ? val.id : undefined);
                  }}
                  value={
                    cities.find((city) => city.id === field.value) || undefined
                  }
                />
              </FormControl>
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
        <Label>Tipo</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o Tipo" />
          </SelectTrigger>
          <SelectContent></SelectContent>
        </Select>
      </div>
      <div className="w-full space-y-2">
        <Label>Nome do Imóvel</Label>
        <Input placeholder="Insira o nome do Imóvel" />
      </div>
      <div className="w-full space-y-2">
        <Label>Cidade</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a Cidade" />
          </SelectTrigger>
          <SelectContent></SelectContent>
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
