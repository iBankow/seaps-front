import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "#/components/ui/field";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { FormDataType, FormSchemaType } from "./create-checklist-wizard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "#/components/ui/card";
import api from "#/lib/axios";

export const SelectUserForm = ({
  form,
  updateFormData,
}: {
  form: UseFormReturn<FormSchemaType>;
  updateFormData: (updates: Partial<FormDataType>) => void;
}) => {
  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      api
        .get("/users", { params: { role: "evaluator" } })
        .then((res) => res.data),
  });

  const users = data?.data || [];

  return (
    <div className="w-full items-center flex flex-col">
      <Card className="grid grid-cols-1 gap-4 bg-card max-w-3xl w-full ">
        <CardContent>
          <FieldGroup>
            <Controller
              name="user_id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel htmlFor="form-rhf-select-model">
                      Responsável pelo Checklist
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
                      const user = users.find((m: any) => m.id === value);
                      updateFormData({
                        user: {
                          id: value,
                          name: user!.name,
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
                      {users?.map((item: { id: string; name: string }) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FieldLabel htmlFor="switch-notifications">
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldTitle>
                          Quem é responsável pelo checklist?
                        </FieldTitle>
                        <FieldDescription>
                          Selecione o usuário que será responsável por
                          acompanhar o checklist. Ele receberá notificações
                          sobre prazos e atualizações.
                        </FieldDescription>
                      </FieldContent>
                    </Field>
                  </FieldLabel>
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
};
