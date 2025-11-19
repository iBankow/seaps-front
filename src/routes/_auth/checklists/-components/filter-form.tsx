"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

import { useEffect, useState, useMemo } from "react";
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
import { api } from "@/lib/api";
import { useRouter, useSearch } from "@tanstack/react-router";
import { FilterChips } from "@/components/ui/filter-chips";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Filter, Search, X } from "lucide-react";
import axios from "axios";
import { ExportModal } from "./export-modal";

const filterSchema = z.object({
  organization_id: z.string().optional(),
  user_id: z.string().optional().nullable(),
  status: z.string().optional(),
  property_name: z.string().optional(),
  city: z.string().optional(),
});

export function DataFilterForm({ data, totalRecords }: { data?: any[], totalRecords?: number }) {
  const searchParams = useSearch({ from: "/_auth/checklists/" });
  const router = useRouter();

  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      organization_id: searchParams.organization_id || "",
      property_name: searchParams.property_name || "",
      user_id: searchParams.user_id || "",
      status: searchParams.status || "",
      city: searchParams.city || "",
    },
  });

  const [organizations, setOrganizations] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [cities, setCities] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mapear labels dos filtros
  const filterLabels = {
    organization_id: "Orgão",
    user_id: "Responsável",
    status: "Status",
    property_name: "Nome do Imóvel",
    city: "Cidade",
  };

  const statusLabels = {
    OPEN: "ABERTO",
    CLOSED: "FECHADO",
  };

  const activeFilters = useMemo(() => {
    const filters = [];

    if (searchParams.organization_id) {
      const org = organizations.find(
        (o) => String(o.id) === searchParams.organization_id
      );
      if (org) {
        filters.push({
          key: "organization_id",
          label: filterLabels.organization_id,
          value: org.name,
        });
      }
    }

    if (searchParams.status) {
      filters.push({
        key: "status",
        label: filterLabels.status,
        value:
          statusLabels[searchParams.status as keyof typeof statusLabels] ||
          searchParams.status,
      });
    }

    if (searchParams.user_id) {
      const user = users.find((u) => String(u.id) === searchParams.user_id);
      if (user) {
        filters.push({
          key: "user_id",
          label: filterLabels.user_id,
          value: user.name,
        });
      }
    }

    if (searchParams.property_name) {
      filters.push({
        key: "property_name",
        label: filterLabels.property_name,
        value: searchParams.property_name,
      });
    }

    if (searchParams.city) {
      const city = cities.find((c) => c.id === searchParams.city);
      filters.push({
        key: "city",
        label: filterLabels.city,
        value: city?.name || searchParams.city,
      });
    }

    return filters;
  }, [searchParams, organizations, users, cities]);

  const handleRemoveFilter = (filterKey: string) => {
    const newSearchParams: any = {
      page: 1,
      per_page: searchParams.per_page || 10,
    };

    // Manter todos os filtros exceto o removido
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== filterKey && value && key !== "page" && key !== "per_page") {
        newSearchParams[key] = value;
      }
    });

    router.navigate({
      to: "/checklists",
      search: newSearchParams,
    });
  };

  const handleClearAll = () => {
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
        })
        .catch(() => {
          // Em caso de erro, inicializa com array vazio
          setCities([]);
        });
    } catch (err) {
      console.error("Error fetching filter data:", err);
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
      city: searchParams.city || "",
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
    <div className="space-y-4">
      {/* Chips de filtros ativos */}
      <FilterChips
        filters={activeFilters}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearAll}
      />

      {/* Botão para abrir modal de filtros */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {activeFilters.length > 0 &&
            `${activeFilters.length} filtro${activeFilters.length !== 1 ? "s" : ""} aplicado${activeFilters.length !== 1 ? "s" : ""}`}
        </div>

        <div className="space-x-2">
          <ExportModal data={data || []} totalRecords={totalRecords} />
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtros Avançados
                {activeFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFilters.length}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>

          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros Avançados
              </DialogTitle>
            </DialogHeader>

            <div className="py-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                                <SelectItem
                                  key={item.id}
                                  value={String(item.id)}
                                >
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
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              {...field}
                              placeholder="Buscar por nome..."
                              className="pl-9"
                              onBlur={(e) => field.onChange(toUpperCase(e))}
                            />
                          </div>
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
                          <FormControl>
                            <RSSelect
                              {...field}
                              placeholder="Selecione o Responsável"
                              options={users}
                              onChange={(val) => {
                                field.onChange(val ? val.id : null);
                              }}
                              value={
                                users.find((user) => user.id === field.value) ||
                                null
                              }
                            />
                          </FormControl>
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
                              placeholder="Selecione a Cidade"
                              options={cities}
                              onChange={(val) => {
                                field.onChange(val ? val.id : undefined);
                              }}
                              value={
                                cities.find(
                                  (city) => city.id === field.value
                                ) || undefined
                              }
                            />
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
                  </div>

                  <DialogFooter className="gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => {
                        form.reset({
                          organization_id: "",
                          user_id: "",
                          status: "",
                          property_name: "",
                          city: "",
                        });
                      }}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Limpar
                    </Button>
                    <Button
                      type="submit"
                      className="gap-2"
                      onClick={() => setIsModalOpen(false)}
                    >
                      <Search className="h-4 w-4" />
                      Aplicar Filtros
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>
    </div>
  );
}

export const LoadingSkeleton = () => {
  return (
    <div className="space-y-4">
      {/* Filtros rápidos skeleton */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-5 w-24 animate-pulse rounded bg-muted" />
          <div className="h-5 w-4 animate-pulse rounded-full bg-muted" />
        </div>
        <div className="flex flex-wrap gap-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-8 w-20 animate-pulse rounded-full bg-muted"
            />
          ))}
        </div>
        <div className="h-px bg-border" />
      </div>

      {/* Botão modal skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        <div className="h-10 w-36 animate-pulse rounded-md bg-muted" />
      </div>
    </div>
  );
};
