import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, type UseFormReturn } from "react-hook-form";
import { useQueries } from "@tanstack/react-query";

import { addressApi } from "@/features/address/api/address";
import type { PropertyFormSchemaType } from "./create-property-wizard";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { toast } from "sonner";

interface AddressFormProps {
  form: UseFormReturn<PropertyFormSchemaType>;
}

export const AddressForm = ({ form }: AddressFormProps) => {
  const selectedState = form.watch("state");

  const results = useQueries({
    queries: [
      {
        queryKey: ["address", "states"],
        queryFn: addressApi.getStates,
      },
      {
        queryKey: ["address", "cities", selectedState],
        queryFn: () => addressApi.getCities(selectedState),
        enabled: !!selectedState,
      },
    ],
  });

  const findAddress = async () => {
    try {
      const address = await addressApi.getAddress(form.getValues("cep"));

      form.setValue("state", address.state?.toUpperCase());
      form.setValue("city", address.city?.toUpperCase());
      form.setValue("neighborhood", address.neighborhood?.toUpperCase());
      form.setValue("street", address.street?.toUpperCase());
      form.setValue(
        "address",
        `${address.street} - ${address.neighborhood}, ${address.city} - ${address.state}, ${address.zipcode}`.toUpperCase(),
      );
    } catch {
      toast.error("Endereço não encontrado para o CEP informado.", {
        description:
          "Verifique o CEP ou informe manualmente os dados do endereço.",
      });
      return;
    }
  };

  const states = results[0].data || [];
  const cities = results[1].data || [];

  return (
    <div className="flex w-full flex-col items-center">
      <Card className="grid w-full max-w-3xl grid-cols-1 gap-4 bg-card">
        <CardContent>
          <FieldGroup>
            <Controller
              name="cep"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel htmlFor="property-cep">CEP</FieldLabel>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                  <div className="flex">
                    <Input
                      {...field}
                      id="property-cep"
                      aria-invalid={fieldState.invalid}
                      placeholder="00000-000"
                      inputMode="numeric"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            .replace(/\D/g, "")
                            .replace(/^(\d{5})(\d)/, "$1-$2")
                            .slice(0, 9),
                        )
                      }
                    />
                    <Button type="button" onClick={findAddress} size="icon">
                      <Search />
                    </Button>
                  </div>
                </Field>
              )}
            />

            <Controller
              name="state"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel htmlFor="property-state">Estado</FieldLabel>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("city", "", { shouldValidate: true });
                    }}
                  >
                    <SelectTrigger
                      id="property-state"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((item) => (
                        <SelectItem key={item.id} value={item.acronym}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            <Controller
              name="city"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel htmlFor="property-city">Cidade</FieldLabel>
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
                      id="property-city"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Selecione a cidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((item) => (
                        <SelectItem key={item.id} value={item.name}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            <Controller
              name="neighborhood"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel htmlFor="property-neighborhood">
                      Bairro
                    </FieldLabel>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                  <Input
                    {...field}
                    id="property-neighborhood"
                    aria-invalid={fieldState.invalid}
                    placeholder="Informe o bairro"
                  />
                </Field>
              )}
            />

            <Controller
              name="street"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel htmlFor="property-street">Rua</FieldLabel>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                  <Input
                    {...field}
                    id="property-street"
                    aria-invalid={fieldState.invalid}
                    placeholder="Informe a rua"
                  />
                </Field>
              )}
            />

            <Controller
              name="number"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel htmlFor="property-number">Número</FieldLabel>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                  <Input
                    {...field}
                    id="property-number"
                    aria-invalid={fieldState.invalid}
                    placeholder="Informe o número (opcional)"
                  />
                </Field>
              )}
            />

            {/* <Controller
              name="address"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel htmlFor="property-address">
                      Endereço Completo
                    </FieldLabel>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                  <Input
                    {...field}
                    id="property-address"
                    aria-invalid={fieldState.invalid}
                    placeholder="Ex: Rua X, 120, Bairro Y"
                  />
                </Field>
              )}
            /> */}
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
};
