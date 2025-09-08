import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Plus, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { RSSelect } from "@/components/react-select";
import { debounce, states, toUpperCase } from "@/lib/utils";
import { NameForm } from "./name-form";

const propertySchema = z.object({
  organization_id: z.string().min(1, "Orgão é obrigatório"),
  person_id: z.string().optional().nullable(),
  type: z.enum(["OWN", "RENTED", "GRANT"]),
  name: z.string().min(1, "Nome é obrigatório").max(255, "Nome muito longo"),
  address: z.string().optional(),
  cep: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  neighborhood: z.string().optional(),
  street: z.string().optional(),
  coordinates: z.string().optional(),
});

type PropertyFormData = z.infer<typeof propertySchema>;

export const PropertyForm = ({
  property,
}: {
  property?: Partial<PropertyFormData & { id: string }>;
}) => {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [persons, setPersons] = useState<any[]>([]);
  const [cities, setCities] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      person_id: null,
      type: "OWN",
      ...property,
    },
  });

  const state = form.watch("state");

  async function findAddressByCEP(cep: string) {
    await axios
      .get(`https://viacep.com.br/ws/${cep}/json/`)
      .then((response) => {
        if (response.data.erro) {
          toast.error("CEP inválido ou não encontrado.");
          return;
        }
        const { data } = response;
        form.setValue("state", data.uf?.toUpperCase());
        form.setValue("city", data.localidade?.toUpperCase());
        form.setValue("neighborhood", data.bairro?.toUpperCase());
        form.setValue("street", data.logradouro?.toUpperCase());
        form.setValue(
          "address",
          `${data.logradouro} - ${data.bairro}, ${data.localidade} - ${data.uf}, ${data.cep}`.toUpperCase()
        );
      })
      .catch(() => toast.error("CEP inválido ou não encontrado."));
  }

  useEffect(() => {
    if (state) {
      axios
        .get(
          `https://brasilapi.com.br/api/ibge/municipios/v1/${state}?providers=dados-abertos-br,gov,wikipedia`
        )
        .then(({ data }) => {
          setCities(
            data.map((city: { nome: string; codigo_ibge: string }) => ({
              id: city.nome.replace(/\s*\(.*?\)/g, ""),
              name: city.nome.replace(/\s*\(.*?\)/g, ""),
            }))
          );
        })
        .catch(() => toast.error("Erro ao buscar as cidades"));
    }
  }, [state]);

  const debouncedfindAddressByCEP = useCallback(
    debounce(findAddressByCEP, 300),
    []
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data } = await api.get("/api/v1/organizations?per_page=100");

        setOrganizations(data.data || []);
      } catch (error) {
        toast.error("Erro ao carregar dados do formulário");
      } finally {
        setDataLoading(false);
      }
    };

    loadData();
  }, []);

  const organization_id = form.watch("organization_id");

  useEffect(() => {
    const loadData = async () => {
      try {
        setDataLoading(true);
        const { data } = await api.get(
          `/api/v1/persons?organization_id=${organization_id}`
        );

        setPersons(data.data || []);
      } finally {
        setDataLoading(false);
      }
    };

    if (organization_id) {
      loadData();
    }
  }, [organization_id]);

  const onSubmit = async (values: PropertyFormData) => {
    setLoading(true);
    try {
      if (property?.id) {
        await api.put(`/api/v1/properties/${property?.id}`, values);
        toast.success("Imóvel atualizado com sucesso!");
        router.navigate({ to: `..`, reloadDocument: true });
      } else {
        const { data } = await api.post("/api/v1/properties", values);
        toast.success("Imóvel criado com sucesso!");
        router.navigate({
          to: "/properties/$propertyId/edit",
          params: { propertyId: data.id },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Informações do Imóvel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="organization_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Orgão *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl
                        className={dataLoading ? "animate-pulse" : ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o Orgão" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {organizations.map((org) => (
                          <SelectItem key={org.id} value={org.id}>
                            {org.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o Tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={"OWN"}>PRÓPRIO</SelectItem>
                        <SelectItem value={"RENTED"}>ALUGADO</SelectItem>
                        <SelectItem value={"GRANT"}>CONCESSÃO</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <NameForm form={form} propertyId={property?.id} />

              <FormField
                control={form.control}
                name="person_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável</FormLabel>
                    <div className="flex gap-1">
                      <RSSelect
                        placeholder="Selecione o Responsável"
                        options={persons}
                        className={dataLoading ? "animate-pulse" : ""}
                        onChange={(val) => {
                          field.onChange(val ? val.id : null);
                        }}
                        value={
                          persons.find((person) => person.id === field.value) ||
                          null
                        }
                      />
                      <Button size={"icon"} type="button" asChild>
                        <Link to="/persons/create" search={{ organization_id }}>
                          <Plus />
                        </Link>
                      </Button>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cep"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="00000-000"
                        maxLength={9}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          const maskedValue = value.replace(
                            /^(\d{5})(\d)/,
                            "$1-$2"
                          );
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
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
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
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <RSSelect
                        {...field}
                        placeholder="Selecione a Cidade Imóvel"
                        options={cities}
                        onChange={(val) => {
                          field.onChange(val ? val.id : null);
                        }}
                        value={
                          cities.find((user) => user.id === field.value) ||
                          undefined
                        }
                        isDisabled={!form.getValues("state")}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="neighborhood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
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
                  <FormItem>
                    <FormLabel>Rua</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Digite a rua"
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
                  <FormItem className="md:col-span-2">
                    <FormLabel>Endereço Completo</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Digite o endereço completo"
                        onBlur={(e) => field.onChange(toUpperCase(e))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coordinates"
                defaultValue=""
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Coordenadas</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: -23.5505,-46.6333" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.navigate({ to: "/properties" })}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading
                  ? "Criando..."
                  : property?.id
                    ? "Salvar Imóvel"
                    : "Criar Imóvel"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};
