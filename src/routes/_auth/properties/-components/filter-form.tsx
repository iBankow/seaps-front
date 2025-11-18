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

import { toUpperCase } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { RSSelect } from "@/components/react-select";
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
import { Filter, Search, Sheet, X } from "lucide-react";
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mapear labels dos filtros
  const filterLabels = {
    organization_id: "Orgão",
    type: "Tipo",
    city: "Cidade",
    state: "Estado",
    name: "Nome do Imóvel",
  };

  const typeLabels = {
    OWN: "PRÓPRIO",
    RENTED: "ALUGADO",
    GRANT: "CONCESSÃO",
  };

  // Opções de filtro rápido

  // Gerar filtros ativos para chips
  const activeFilters = useMemo(() => {
    const filters = [];

    if (search.organization_id) {
      const org = organizations.find(
        (o) => String(o.id) === search.organization_id
      );
      if (org) {
        filters.push({
          key: "organization_id",
          label: filterLabels.organization_id,
          value: org.name,
        });
      }
    }

    if (search.type) {
      filters.push({
        key: "type",
        label: filterLabels.type,
        value:
          typeLabels[search.type as keyof typeof typeLabels] || search.type,
      });
    }

    if (search.city) {
      const city = cities.find((c) => c.id === search.city);
      filters.push({
        key: "city",
        label: filterLabels.city,
        value: city?.name || search.city,
      });
    }

    if (search.state) {
      filters.push({
        key: "state",
        label: filterLabels.state,
        value: search.state,
      });
    }

    if (search.name) {
      filters.push({
        key: "name",
        label: filterLabels.name,
        value: search.name,
      });
    }

    return filters;
  }, [search, organizations, cities]);

  const handleRemoveFilter = (filterKey: string) => {
    const currentSearch = { ...search };
    delete currentSearch[filterKey as keyof typeof currentSearch];

    navigate({
      search: {
        ...currentSearch,
        page: 1,
      },
      replace: true,
    });
  };

  const handleClearAll = () => {
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
    <div className="space-y-4">
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
          <Button variant="outline" className="gap-2">
            <Sheet className="h-4 w-4" />
            Exportar Datos
          </Button>
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

            <DialogContent
              className="max-w-4xl max-h-[80vh] overflow-y-auto"
              onWheel={(e) => e.stopPropagation()}
            >
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
                            city: undefined,
                            name: "",
                            organization_id: "",
                            type: "",
                            state: "",
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
          {[1, 2, 3].map((i) => (
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
