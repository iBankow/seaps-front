import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { RSSelect } from "@/components/react-select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Filter, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { initialData } from "#/lib/axios";
import { Field, FieldError, FieldLabel } from "#/components/ui/field";
import { useQueries } from "@tanstack/react-query";
import { organizationsApi } from "#/features/organizations/api/organizations";
import { addressApi } from "#/features/address/api/address";
import { FilterChips } from "@/components/ui/filter-chips";
import { TypeLabel } from "../../types";
import debounce from "lodash.debounce";
import { Separator } from "@/components/ui/separator";

const filterSchema = z.object({
  organization_id: z.string().optional(),
  type: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  name: z.string().optional(),
});

export function DataFilterForm({}: { data?: any[]; totalRecords?: number }) {
  const search = useSearch({ from: "/_auth/properties/" });
  const navigate = useNavigate({ from: "/properties" });

  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const results = useQueries({
    queries: [
      {
        queryKey: ["organizations"],
        queryFn: organizationsApi.list,
        initialData,
      },
      {
        queryKey: ["cities"],
        queryFn: async () => {
          const data = await addressApi.getCities("MT");
          return data;
        },
        initialData: [],
      },
    ],
  });

  const isLoading = results.some((q) => q.isPending);

  const organizations = results[0].data.data || [];
  const cities = results[1].data || [];

  // Mapear labels dos filtros
  const filterLabels = {
    organization_id: "Orgão",
    type: "Tipo",
    city: "Cidade",
    state: "Estado",
    name: "Nome do Imóvel",
  };

  // Opções de filtro rápido
  // Gerar filtros ativos para chips
  const activeFilters = useMemo(() => {
    const filters = [];

    if (search.organization_id) {
      const org = organizations.find(
        (o) => String(o.id) === search.organization_id,
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
        value: TypeLabel[search.type] || search.type,
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
        name: values.name?.toUpperCase() || undefined,
        organization_id: values.organization_id || undefined,
        type: values.type || undefined,
        city: values.city || undefined,
      },
    });
  }

  const setPropertyNameFilter = (value: string) => {
    if (value.trim().length >= 3 || value.trim().length === 0) {
      form.setValue("name", value.toUpperCase());
      onSubmit(form.getValues());
    }
  };

  const debouncedPropertyFilterName = useCallback(
    debounce(setPropertyNameFilter, 400),
    [],
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* Botão para abrir modal de filtros */}
      <div className="flex items-center gap-2 w-full">
        <Input
          id="input-property-name"
          className="uppercase placeholder:normal-case w-full"
          placeholder="Pesquisar imóvel..."
          defaultValue={form.getValues("name")}
          onChange={(e) => debouncedPropertyFilterName(e.target.value)}
        />
        <div className="space-x-2">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                {activeFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFilters.length}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>

            <DialogContent
              className="sm:max-w-5xl sm:w-full"
              onWheel={(e) => e.stopPropagation()}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtros Avançados
                </DialogTitle>
              </DialogHeader>

              <div className="py-4">
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Controller
                      control={form.control}
                      name="organization_id"
                      render={({ field }) => (
                        <Field>
                          <FieldLabel>Orgão</FieldLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || undefined}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o Orgão" />
                            </SelectTrigger>
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
                          <FieldError />
                        </Field>
                      )}
                    />

                    <Controller
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <Field>
                          <FieldLabel>Tipo</FieldLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || undefined}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o Tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(TypeLabel).map(
                                ([value, label]) => (
                                  <SelectItem key={value} value={value}>
                                    {label}
                                  </SelectItem>
                                ),
                              )}
                            </SelectContent>
                          </Select>
                          <FieldError />
                        </Field>
                      )}
                    />

                    <Controller
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <Field className="w-full">
                          <FieldLabel>Nome do Imóvel</FieldLabel>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              {...field}
                              placeholder="Buscar por nome..."
                              className="pl-9 uppercase placeholder:normal-case"
                              onBlur={(e) =>
                                field.onChange(
                                  e.target.value.trim() === ""
                                    ? undefined
                                    : e.target.value,
                                )
                              }
                            />
                          </div>
                          <FieldError />
                        </Field>
                      )}
                    />

                    <Controller
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <Field>
                          <FieldLabel>Cidade</FieldLabel>
                          <RSSelect
                            {...field}
                            placeholder="Selecione a Cidade"
                            options={cities}
                            onChange={(val) => {
                              field.onChange(val ? val.id : undefined);
                            }}
                            value={
                              cities.find((city) => city.id === field.value) ||
                              undefined
                            }
                          />
                        </Field>
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
              </div>
            </DialogContent>
          </Dialog>
          {/* <ExportModal data={data || []} totalRecords={totalRecords} /> */}
        </div>
      </div>

      <FilterChips
        filters={activeFilters}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearAll}
      />

      <Separator />
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
