import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, type UseFormReturn } from "react-hook-form";
import { useQueries } from "@tanstack/react-query";

import { organizationsApi } from "@/features/organizations";
import { initialData } from "@/types";
import type {
  PropertyFormDataType,
  PropertyFormSchemaType,
} from "./create-property-wizard";
import { NameForm } from "./name-form";

const propertyTypes = [
  { value: "OWN", label: "PRÓPRIO" },
  { value: "RENTED", label: "ALUGADO" },
  { value: "GRANT", label: "CEDIDO" },
  { value: "GUARANTY", label: "CAUÇÃO" },
  { value: "AFFECTATION", label: "AFETAÇÃO" },
  { value: "DONATION", label: "DOAÇÃO" },
];

interface DetailsFormProps {
  form: UseFormReturn<PropertyFormSchemaType>;
  updateFormData: (updates: Partial<PropertyFormDataType>) => void;
}

export const DetailsForm = ({ form, updateFormData }: DetailsFormProps) => {
  const results = useQueries({
    queries: [
      {
        queryKey: ["organizations"],
        queryFn: organizationsApi.list,
        initialData,
      },
    ],
  });

  const organizations = results[0].data.data || [];

  return (
    <div className="flex w-full flex-col items-center">
      <Card className="grid w-full max-w-3xl grid-cols-1 gap-4 bg-card">
        <CardContent>
          <FieldGroup>
            <Controller
              name="type"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel htmlFor="property-type">
                      Tipo do Imóvel
                    </FieldLabel>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="property-type"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            <Controller
              name="organization_id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel htmlFor="organization-id">
                      Organização
                    </FieldLabel>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      const organization = organizations.find(
                        (item) => item.id === value,
                      );
                      if (organization) {
                        updateFormData({
                          organization: {
                            id: organization.id,
                            name: organization.name,
                          },
                        });
                      }
                    }}
                  >
                    <SelectTrigger
                      id="organization-id"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Selecione a organização" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizations.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            <NameForm form={form} />
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
};
