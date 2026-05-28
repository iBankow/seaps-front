import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Save } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { RSSelect } from "@/components/react-select";
import { NameForm } from "./name-form";
import { AddressForm } from "./address-form";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { TypeLabel, type Property } from "../types";
import { usePersonsList } from "@/features/persons/api/persons";
import { CreatePersonDialog } from "@/features/persons/ui/create-person-dialog";
import { useUpdateProperty } from "../api/properties";

const propertySchema = z.object({
  organization_id: z.string().min(1, "Orgão é obrigatório"),
  person_id: z.string().optional().nullable(),
  type: z.enum(["OWN", "RENTED", "GRANT", "PRIVATE"]),
  name: z.string().min(1, "Nome é obrigatório").max(255, "Nome muito longo"),
  address: z.string().optional(),
  cep: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  neighborhood: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
});

type PropertyFormData = z.infer<typeof propertySchema>;

export const EditPropertyForm = ({ property }: { property: Property }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const updateProperty = useUpdateProperty();

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      ...property,
      number: property?.number || "",
    },
  });

  const onSubmit = async (values: PropertyFormData) => {
    setLoading(true);
    try {
      await updateProperty.mutateAsync({
        id: property.id,
        payload: {
          ...values,
          cep: values.cep || "",
          state: values.state || "",
          city: values.city || "",
          neighborhood: values.neighborhood || "",
          street: values.street || "",
          person_id: values.person_id || "",
          address:
            `${values.street} - ${values.neighborhood}, ${values.city} - ${values.state}, ${values.cep}`.toUpperCase(),
        },
      });

      toast.success("Imóvel atualizado com sucesso!");
      router.navigate({ to: `..` });
    } finally {
      setLoading(false);
    }
  };

  const {
    data: { data: persons },
  } = usePersonsList({
    organization_id: property?.organization_id,
    per_page: 1000,
  });

  return (
    <form id="update-property-form" onSubmit={form.handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Informações do Imóvel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="organization-name">Orgão *</FieldLabel>
              <Input
                id="organization-name"
                disabled
                value={property?.organization?.name}
              />
            </Field>
            <Controller
              control={form.control}
              name="type"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel htmlFor="property-type">Tipo *</FieldLabel>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      id="property-type"
                      className="w-full"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Selecione o Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(TypeLabel).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
            <NameForm
              form={form}
              propertyId={property?.id}
              className="sm:col-span-2 w-full"
            />
          </div>
          <Separator />
          <Controller
            control={form.control}
            name="person_id"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor="property-person">Responsável</FieldLabel>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
                <div className="flex gap-1">
                  <RSSelect
                    placeholder="Selecione o Responsável"
                    options={persons}
                    onChange={(val) => {
                      field.onChange(val ? val.id : null);
                    }}
                    value={
                      persons.find((person) => person.id === field.value) ||
                      null
                    }
                  />
                  <CreatePersonDialog
                    organizationId={property?.organization_id || ""}
                  >
                    <Button type="button" size="icon" id="property-person">
                      <Plus />
                    </Button>
                  </CreatePersonDialog>
                </div>
              </Field>
            )}
          />
          <Separator />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <AddressForm form={form} />
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              variant="destructive"
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
  );
};
