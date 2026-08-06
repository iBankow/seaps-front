import { Controller, type UseFormReturn } from "react-hook-form";
import type { FormDataType, FormSchemaType } from "./create-checklist-wizard";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePropertiesList } from "@/features/properties";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Filter, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useQuery } from "@tanstack/react-query";
import { addressApi } from "@/features/address";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectPropertyFormProps {
  form: UseFormReturn<FormSchemaType>;
  updateFormData: (updates: Partial<FormDataType>) => void;
}

export const SelectPropertyForm = ({
  form,
  updateFormData,
}: SelectPropertyFormProps) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    city: undefined,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
  });

  const { data, isLoading } = usePropertiesList({
    name: search !== "" ? search : undefined,
    page: pagination.page,
    per_page: pagination.per_page,
    organization_id: form.getValues("organization_id"),
    city: filter.city,
  });

  const properties = data?.data ?? [];

  const updateFilter = (updates: Partial<typeof filter>) => {
    const newFilter =
      updates.city === "" ? { city: undefined } : { city: updates.city };
    setFilter(newFilter);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <Card className="overflow-clip">
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl font-semibold">
          Selecione a propriedade
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Escolha a propriedade para a qual deseja criar o checklist.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Buscar propriedade"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <DrawerDialogFilter handleUpdateFilter={updateFilter} />
        </div>
        <div>
          {filter.city && (
            <Button
              variant="outline"
              size="sm"
              className="bg-primary/20! border-primary!"
              onClick={() => updateFilter({ city: undefined })}
            >
              <div className="flex items-center gap-1">
                <X className="text-destructive" />
                <span className="text-primary-foreground">{filter.city}</span>
              </div>
            </Button>
          )}
        </div>
        <Controller
          name="property_id"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <RadioGroup
                value={field.value}
                onValueChange={(fieldValue) => {
                  field.onChange(fieldValue);
                  const property = properties.find(
                    (property) => property.id === fieldValue,
                  );
                  updateFormData({
                    property: property,
                  });
                }}
                className="md:grid-cols-2 overflow-y-auto scrollbar-custom min-h-77 max-h-77"
              >
                {!isLoading && properties.length === 0 && (
                  <div className="col-span-2 py-8 text-center">
                    <div className="text-muted-foreground text-sm">
                      {search
                        ? "Nenhuma propriedade encontrada"
                        : "Nenhuma propriedade cadastrada"}
                    </div>
                  </div>
                )}
                {properties.length > 0 &&
                  properties.map((property) => (
                    <FieldLabel
                      key={property.id}
                      htmlFor={`form-rhf-radiogroup-${property.id}`}
                      className="h-fit"
                    >
                      <Field
                        orientation="horizontal"
                        className="items-center flex"
                        data-invalid={fieldState.invalid}
                      >
                        <FieldContent>
                          <FieldTitle>{property.name}</FieldTitle>
                          <FieldDescription className="line-clamp-1">
                            {property.city ?? "--"}
                          </FieldDescription>
                          <FieldDescription className="line-clamp-1">
                            {property.address.trim()}
                          </FieldDescription>
                        </FieldContent>
                        <RadioGroupItem
                          value={property.id}
                          id={`form-rhf-radiogroup-${property.id}`}
                          className="self-center"
                          aria-invalid={fieldState.invalid}
                        />
                      </Field>
                    </FieldLabel>
                  ))}
              </RadioGroup>
            </Field>
          )}
        />
        {data?.meta && data.meta.last_page > 1 && (
          <div className="mt-4">
            <PropertiesPagination
              meta={data?.meta}
              onSelectPage={(page: number) =>
                setPagination((prev) => ({ ...prev, page }))
              }
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const PropertiesPagination = ({ meta, onSelectPage }: any) => {
  const LE = "-3";
  const RE = "+3";

  const generatePages = () => {
    const current = Math.min(meta?.current_page || 1, meta?.current_page || 1);
    const total = Math.max(1, meta?.last_page || 1);

    if (total <= 7) {
      return Array.from({ length: total }).map((_, i) => i + 1);
    }

    if (current < 3) {
      return [1, 2, 3, RE, total - 1, total];
    }

    if (current === 3) {
      return [1, 2, 3, 4, RE, total - 1, total];
    }

    if (current > total - 2) {
      return [1, 2, LE, total - 2, total - 1, total];
    }

    if (current === total - 2) {
      return [1, 2, LE, total - 3, total - 2, total - 1, total];
    }

    return [1, LE, current - 1, current, current + 1, RE, total];
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem className="hidden sm:block">
          <Button
            variant="ghost"
            type="button"
            disabled={meta?.prev_page === null}
            onClick={() =>
              onSelectPage(meta?.current_page ? meta?.current_page - 1 : 1)
            }
          >
            <ChevronLeft />
            Anterior
          </Button>
        </PaginationItem>
        {generatePages().map((item, index) => {
          if (typeof item === "string") {
            return (
              <PaginationItem key={index}>
                <Button variant="ghost" disabled size="icon">
                  <PaginationEllipsis />
                </Button>
              </PaginationItem>
            );
          }
          return (
            <PaginationItem key={index} onClick={() => onSelectPage(item)}>
              <Button
                variant={meta?.current_page === item ? "secondary" : "ghost"}
                size="icon"
                type="button"
              >
                {item}
              </Button>
            </PaginationItem>
          );
        })}
        <PaginationItem className="hidden sm:block">
          <Button
            variant="ghost"
            type="button"
            disabled={meta?.next_page === null}
            onClick={() =>
              onSelectPage(meta?.current_page ? meta?.current_page + 1 : 1)
            }
          >
            <ChevronRight />
            Proximo
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

const FilterDialog = ({
  handleUpdateFilter,
}: {
  handleUpdateFilter: (filter: any) => void;
}) => {
  const [filter, setFilter] = useState({
    state: "MT",
    city: "",
  });

  const statesQuery = useQuery({
    queryKey: ["address", "states"],
    queryFn: addressApi.getStates,
  });

  const citiesQuery = useQuery({
    queryKey: ["address", "cities", filter.state],
    queryFn: () => addressApi.getCities(filter.state),
  });

  return (
    <FieldGroup>
      <Field>
        <Label htmlFor="name-1">Estado</Label>
        <Select
          defaultValue={filter.state}
          onValueChange={(value) => setFilter({ ...filter, state: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Escolha um estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {statesQuery.data?.map((state) => (
                <SelectItem key={state.id} value={state.acronym}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <Label htmlFor="name-1">Cidade</Label>
        <Select
          defaultValue={filter.city}
          onValueChange={(value) => {
            handleUpdateFilter({ city: value });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Escolha uma cidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {citiesQuery.data?.map((city) => (
                <SelectItem key={city.id} value={city.name}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Button
        onClick={() => {
          handleUpdateFilter({ city: "" });
        }}
      >
        Limpar
      </Button>
    </FieldGroup>
  );
};

export function DrawerDialogFilter({
  handleUpdateFilter,
}: {
  handleUpdateFilter: (filter: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const onFilterChange = (filter: any) => {
    handleUpdateFilter(filter);
    setOpen(false);
  };

  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Filter />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filtro de Propriedades</DialogTitle>
            <DialogDescription>
              Aqui você pode aplicar filtros para encontrar a propriedade
              desejada.
            </DialogDescription>
          </DialogHeader>
          <FilterDialog handleUpdateFilter={onFilterChange} />
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon">
          <Filter />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Filtro de Propriedades</DrawerTitle>
          <DrawerDescription>
            Aqui você pode aplicar filtros para encontrar a propriedade
            desejada.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-2">
          <FilterDialog handleUpdateFilter={onFilterChange} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
