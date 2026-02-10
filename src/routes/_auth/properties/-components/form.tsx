import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { NameForm } from "./name-form";
import { AddressForm } from "./address-form";
import { Separator } from "@/components/ui/separator";

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
  number: z.string().optional(),
  // coordinates: z.string().optional(),
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
          `/api/v1/persons?per_page=1000&organization_id=${organization_id}`,
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
        await api.put(`/api/v1/properties/${property?.id}`, {
          ...values,
          address:
            `${values.street} - ${values.neighborhood}, ${values.city} - ${values.state}, ${values.cep}`.toUpperCase(),
        });
        toast.success("Imóvel atualizado com sucesso!");
        router.navigate({ to: `..`, reloadDocument: true });
      } else {
        const { data } = await api.post("/api/v1/properties", {
          ...values,
          address:
            `${values.street} - ${values.neighborhood}, ${values.city} - ${values.state}, ${values.cep}`.toUpperCase(),
        });
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
          <CardContent className="space-y-4">
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
            </div>
            <Separator />
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
            <Separator />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
              <AddressForm form={form} />
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
