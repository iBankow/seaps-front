import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCallback, useState } from "react";

import { Input } from "@/components/ui/input";
import { Loader2Icon } from "lucide-react";
import { toUpperCase } from "@/lib/utils";
import { type UseFormReturn } from "react-hook-form";
import debounce from "lodash.debounce";
import { api } from "@/lib/api";

export const NameForm = ({
  form,
  propertyId,
}: {
  form: UseFormReturn<any>;
  propertyId?: string;
}) => {
  const [isChecking, setIsChecking] = useState(false);

  const checkNameExists = async (name: string) => {
    if (!name) {
      form.clearErrors("name");
      return;
    }

    setIsChecking(true);

    try {
      const { data } = await api.get(`/api/v1/properties/check`, {
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedCheckName = useCallback(debounce(checkNameExists, 500), []);

  return (
    <FormField
      control={form.control}
      name="name"
      defaultValue={""}
      render={({ field }) => (
        <FormItem className="relative w-full md:col-span-2">
          <FormLabel>Nome do Imóvel *</FormLabel>
          <div className="relative">
            <FormControl>
              <Input
                placeholder="Nome do imóvel ou local"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  debouncedCheckName(e.target.value);
                }}
                onBlur={(e) => field.onChange(toUpperCase(e))}
              />
            </FormControl>
            {isChecking && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Loader2Icon className="animate-spin" />
              </div>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
