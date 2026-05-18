import { Controller, type UseFormReturn } from "react-hook-form";
import { useCallback, useState } from "react";
import { Input } from "#/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";
import { RadioGroup, RadioGroupItem } from "#/components/ui/radio-group";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "#/components/ui/field";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "#/components/ui/pagination";
import { Button } from "#/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type {
  PropertyFormDataType,
  PropertyFormSchemaType,
} from "./create-property-wizard";
import { usePersonsList } from "#/features/persons/api/persons";
import { CreatePersonDialog } from "#/features/persons/ui/create-person-dialog";
import debounce from "lodash.debounce";

interface SelectPersonFormProps {
  form: UseFormReturn<PropertyFormSchemaType>;
  updateFormData: (updates: Partial<PropertyFormDataType>) => void;
}

export const SelectPersonForm = ({
  form,
  updateFormData,
}: SelectPersonFormProps) => {
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
  });

  const { data, isLoading } = usePersonsList({
    name: search !== "" ? search : undefined,
    page: pagination.page,
    per_page: pagination.per_page,
    organization_id: form.getValues("organization_id"),
  });

  const persons = data?.data ?? [];

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearch(query.trim());
    }, 400),
    [],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <Card className="overflow-clip">
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl font-semibold justify-between flex items-center">
          <p>Selecione o Responsável</p>
          <CreatePersonDialog
            organizationId={form.getValues("organization_id")}
          />
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Escolha quem será responsável por este imóvel.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Buscar responsável"
            defaultValue={""}
            onChange={handleChange}
          />
        </div>
        <Controller
          name="person_id"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <RadioGroup
                value={field.value}
                onValueChange={(fieldValue) => {
                  field.onChange(fieldValue);
                  const user = persons.find((u) => u.id === fieldValue);
                  if (user) {
                    updateFormData({
                      person: {
                        id: user.id,
                        name: user.name,
                      },
                    });
                  }
                }}
                className="md:grid-cols-2 overflow-y-auto scrollbar-custom min-h-77 max-h-77"
              >
                {!isLoading && persons.length === 0 && (
                  <div className="col-span-2 py-8 text-center">
                    <div className="text-muted-foreground text-sm">
                      {search
                        ? "Nenhum responsável encontrado"
                        : "Nenhum responsável cadastrado"}
                    </div>
                  </div>
                )}
                {persons.length > 0 &&
                  persons.map((user) => (
                    <FieldLabel
                      key={user.id}
                      htmlFor={`form-rhf-radiogroup-${user.id}`}
                      className="h-fit"
                    >
                      <Field
                        orientation="horizontal"
                        className="items-center flex"
                        data-invalid={fieldState.invalid}
                      >
                        <FieldContent>
                          <FieldTitle>{user.name}</FieldTitle>
                          <FieldDescription className="line-clamp-1">
                            {user.email}
                          </FieldDescription>
                        </FieldContent>
                        <RadioGroupItem
                          value={user.id}
                          id={`form-rhf-radiogroup-${user.id}`}
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
            <PersonPagination
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

const PersonPagination = ({ meta, onSelectPage }: any) => {
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
            Próximo
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
