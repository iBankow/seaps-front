import { useCallback, useState } from "react";

import { Input } from "@/components/ui/input";
import { Loader2Icon } from "lucide-react";
import { Controller, type UseFormReturn } from "react-hook-form";
import debounce from "lodash.debounce";
import api from "#/lib/axios";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "#/components/ui/field";

export const NameForm = ({
  form,
  propertyId,
  className,
}: {
  form: UseFormReturn<any>;
  propertyId?: string;
  className?: string;
}) => {
  const [isChecking, setIsChecking] = useState(false);

  const checkNameExists = async (name: string) => {
    if (!name) {
      form.clearErrors("name");
      return;
    }

    setIsChecking(true);

    try {
      const { data } = await api.get(`/properties/check`, {
        params: {
          name: name,
          id: propertyId,
          organization_id: form.getValues("organization_id"),
        },
      });

      if (!data.ok) {
        form.setError("name", {
          type: "manual",
          message: "É possivel que este imóvel já tenha sido criado",
        });
      } else {
        form.clearErrors("name");
      }
    } catch {
      form.setError("name", {
        type: "manual",
        message: "Erro ao verificar nome",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const debouncedCheckName = useCallback(debounce(checkNameExists, 500), []);

  return (
    <Controller
      control={form.control}
      name="name"
      defaultValue={""}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={className}>
          <FieldContent>
            <FieldLabel htmlFor="property-name">Nome do Imóvel</FieldLabel>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </FieldContent>
          <div className="relative">
            <Input
              {...field}
              id="property-name"
              aria-invalid={fieldState.invalid}
              placeholder="Ex: Residencial Palmeiras"
              className={"uppercase placeholder:normal-case"}
              onChange={(e) => {
                field.onChange(e);
                debouncedCheckName(e.target.value);
              }}
            />
            {isChecking && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Loader2Icon className="animate-spin" />
              </div>
            )}
          </div>
        </Field>
      )}
    />
  );
};
