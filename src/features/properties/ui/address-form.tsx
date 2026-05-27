import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RSSelect } from "@/components/react-select";
import { debounce, states, toUpperCase } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Controller } from "react-hook-form";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";

export const AddressForm = (props: any) => {
  const { form } = props;

  const [cities, setCities] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const state = form.watch("state");

  async function findAddressByCEP(cep: string) {
    setLoading(true);
    await api
      .get("api/v1/address/zipcode/" + cep)
      .then((response) => {
        const { data } = response;

        form.setValue("state", data.state?.toUpperCase());
        form.setValue("city", data.city?.toUpperCase());
        form.setValue("neighborhood", data.neighborhood?.toUpperCase());
        form.setValue("street", data.street?.toUpperCase());
        form.setValue(
          "address",
          `${data.street} - ${data.neighborhood}, ${data.city} - ${data.state}, ${data.zipcode}`.toUpperCase(),
        );
      })
      .catch(() => toast.error("CEP inválido ou não encontrado."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (state) {
      setLoading(true);
      api
        .get(`api/v1/address/states/${state}`)
        .then(({ data }) => {
          setCities(
            data.map((city: { name: string; id: string }) => ({
              id: city.name.replace(/\s*\(.*?\)/g, ""),
              name: city.name.replace(/\s*\(.*?\)/g, ""),
            })),
          );
        })
        .catch(() => toast.error("Erro ao buscar as cidades"))
        .finally(() => setLoading(false));
    }
  }, [state]);

  const debouncedfindAddressByCEP = useCallback(
    debounce(findAddressByCEP, 300),
    [],
  );

  return (
    <>
      <Controller
        control={form.control}
        name="cep"
        render={({ field }) => (
          <Field className="md:col-span-2">
            <FieldLabel>CEP</FieldLabel>
            <FieldContent>
              <Input
                {...field}
                placeholder="00000-000"
                disabled={loading}
                className={loading ? "animate-pulse" : ""}
                maxLength={9}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  const maskedValue = value.replace(/^(\d{5})(\d)/, "$1-$2");
                  field.onChange(maskedValue);

                  if (maskedValue.length === 9) {
                    debouncedfindAddressByCEP(maskedValue);
                  }
                }}
              />
            </FieldContent>
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="state"
        render={({ field }) => (
          <Field className="md:col-span-3">
            <FieldLabel>Estado</FieldLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value || undefined}
            >
              <FieldContent>
                <SelectTrigger
                  className={loading ? "animate-pulse" : ""}
                  disabled={loading}
                >
                  <SelectValue placeholder="Selecione o Estado" />
                </SelectTrigger>
              </FieldContent>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state.acronym} value={state.acronym}>
                    {state.name.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="city"
        render={({ field }) => (
          <Field className="md:col-span-3">
            <FieldLabel>Cidade</FieldLabel>
            <FieldContent>
              <RSSelect
                {...field}
                className={loading ? "animate-pulse" : ""}
                placeholder="Selecione a Cidade Imóvel"
                options={cities}
                onChange={(val) => {
                  field.onChange(val ? val.id : null);
                }}
                value={
                  cities.find((city: any) => city.id === field.value) ||
                  undefined
                }
                isDisabled={!form.getValues("state") || loading}
              />
            </FieldContent>
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="neighborhood"
        render={({ field }) => (
          <Field className="md:col-span-2">
            <FieldLabel>Bairro</FieldLabel>
            <FieldContent>
              <Input
                {...field}
                className={loading ? "animate-pulse" : ""}
                disabled={loading}
                placeholder="Digite o bairro"
                onBlur={(e) => field.onChange(toUpperCase(e))}
              />
            </FieldContent>
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="street"
        render={({ field }) => (
          <Field className="md:col-span-4">
            <FieldLabel>Rua</FieldLabel>
            <FieldContent>
              <Input
                {...field}
                placeholder="Digite a rua"
                className={loading ? "animate-pulse" : ""}
                disabled={loading}
                onBlur={(e) => field.onChange(toUpperCase(e))}
              />
            </FieldContent>
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="number"
        render={({ field }) => (
          <Field className="md:col-span-1">
            <FieldLabel>Número</FieldLabel>
            <FieldContent>
              <Input
                {...field}
                placeholder="Digite o número"
                className={loading ? "animate-pulse" : ""}
                disabled={loading}
                onBlur={(e) => field.onChange(toUpperCase(e))}
              />
            </FieldContent>
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="address"
        render={({ field }) => (
          <Field className="md:col-span-5">
            <FieldLabel>Endereço Completo</FieldLabel>
            <FieldContent>
              <Input
                {...field}
                placeholder="Digite o endereço completo"
                className={loading ? "animate-pulse" : ""}
                disabled={loading}
                onBlur={(e) => field.onChange(toUpperCase(e))}
              />
            </FieldContent>
          </Field>
        )}
      />
    </>
  );
};
