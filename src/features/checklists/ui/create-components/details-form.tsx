import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { FormDataType, FormSchemaType } from "./create-checklist-wizard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useModelsList } from "@/features/models";
import { Card, CardContent } from "@/components/ui/card";
import { organizationsApi } from "@/features/organizations";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

export const DetailsForm = ({
  form,
  updateFormData,
}: {
  form: UseFormReturn<FormSchemaType>;
  updateFormData: (updates: Partial<FormDataType>) => void;
}) => {
  const { data } = useModelsList();

  const { data: organizationsData } = useQuery({
    queryKey: ["organizations"],
    queryFn: organizationsApi.list,
  });

  const models = data?.data || [];
  const organizations = organizationsData?.data || [];

  const isReturned = form.watch("is_returned");

  return (
    <div className="w-full items-center flex flex-col">
      <Card className="grid grid-cols-1 gap-4 bg-card max-w-3xl w-full ">
        <CardContent>
          <FieldGroup>
            <Controller
              name="model_id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel htmlFor="form-rhf-select-model">
                      Modelo
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
                      const model = models.find((m) => m.id === value);
                      updateFormData({
                        model: {
                          id: value,
                          name: model!.name,
                        },
                      });
                    }}
                  >
                    <SelectTrigger
                      id="form-rhf-select-model"
                      aria-invalid={fieldState.invalid}
                      className="min-w-30"
                    >
                      <SelectValue placeholder="Selecione o modelo" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      {models?.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
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
                    <FieldLabel htmlFor="form-rhf-select-organization">
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
                        (m) => m.id === value,
                      );
                      updateFormData({
                        organization: {
                          id: value,
                          name: organization!.name,
                        },
                      });
                      form.resetField("property_id");
                    }}
                  >
                    <SelectTrigger
                      id="form-rhf-select-organization"
                      aria-invalid={fieldState.invalid}
                      className="min-w-30"
                    >
                      <SelectValue placeholder="Selecione o órgão" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      {organizations?.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
            <Controller
              name="is_returned"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="switch-notifications">
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldTitle>É um Checklist de Retorno?</FieldTitle>
                        <FieldDescription>
                          Selecione se este checklist é um checklist de retorno.
                          Checklists de retorno são usados para registrar
                          serviços que já foram realizados e precisam ser
                          verificados ou inspecionados novamente.
                        </FieldDescription>
                      </FieldContent>
                      <Switch
                        id="switch-notifications"
                        name={field.name}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-invalid={fieldState.invalid}
                        defaultChecked
                      />
                    </Field>
                  </FieldLabel>
                </Field>
              )}
            />

            {isReturned && (
              <Controller
                name="return"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel htmlFor="form-rhf-select-return">
                        Retorno
                      </FieldLabel>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>
                    <Input
                      {...field}
                      id="form-rhf-select-return"
                      placeholder="Informe o número do checklist de retorno"
                      inputMode="numeric"
                      aria-invalid={fieldState.invalid}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(e.target.value.replace(/[^0-9]/g, ""))
                      }
                    />
                  </Field>
                )}
              />
            )}
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
};
