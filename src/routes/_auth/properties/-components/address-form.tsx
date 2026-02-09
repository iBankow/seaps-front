import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { RSSelect } from "@/components/react-select";
import { debounce, states, toUpperCase } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

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
      <FormField
        control={form.control}
        name="cep"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>CEP</FormLabel>
            <FormControl>
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
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="state"
        render={({ field }) => (
          <FormItem className="md:col-span-3">
            <FormLabel>Estado</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value || undefined}
            >
              <FormControl>
                <SelectTrigger
                  className={loading ? "animate-pulse" : ""}
                  disabled={loading}
                >
                  <SelectValue placeholder="Selecione o Estado" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state.acronym} value={state.acronym}>
                    {state.name.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="city"
        render={({ field }) => (
          <FormItem className="md:col-span-3">
            <FormLabel>Cidade</FormLabel>
            <FormControl>
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
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="neighborhood"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Bairro</FormLabel>
            <FormControl>
              <Input
                {...field}
                className={loading ? "animate-pulse" : ""}
                disabled={loading}
                placeholder="Digite o bairro"
                onBlur={(e) => field.onChange(toUpperCase(e))}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="street"
        render={({ field }) => (
          <FormItem className="md:col-span-4">
            <FormLabel>Rua</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Digite a rua"
                className={loading ? "animate-pulse" : ""}
                disabled={loading}
                onBlur={(e) => field.onChange(toUpperCase(e))}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="number"
        render={({ field }) => (
          <FormItem className="md:col-span-1">
            <FormLabel>Número</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Digite o número"
                className={loading ? "animate-pulse" : ""}
                disabled={loading}
                onBlur={(e) => field.onChange(toUpperCase(e))}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem className="md:col-span-5">
            <FormLabel>Endereço Completo</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Digite o endereço completo"
                className={loading ? "animate-pulse" : ""}
                disabled={loading}
                onBlur={(e) => field.onChange(toUpperCase(e))}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};
