import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Save,
  ChevronLeft,
  ChevronRight,
  Search,
  Building,
} from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Steps, StepContent, StepActions } from "@/components/ui/steps";

const formSchema = z.object({
  model_id: z.string({
    message: "Selecione um modelo de checklist",
  }),
  organization_id: z.string({
    message: "Selecione o Orgão",
  }),
  property_id: z.string({
    message: "Selecione o Imóvel",
  }),
  user_id: z.string({
    message: "Selecione o Responsável pelo Checklist",
  }),
  is_returned: z.boolean({
    message: "Selecione se o checklist é de retorno",
  }),
  return: z.number().optional(),
});

export function CreateCheckListForm({ checklist }: { checklist?: any }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  const [organizations, setOrganizations] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [propertiesMeta, setPropertiesMeta] = useState<any>({});
  const [propertyFilter, setPropertyFilter] = useState("");
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: checklist ?? {
      organization_id: "",
      model_id: "",
      property_id: "",
      user_id: "",
      is_returned: false,
    },
  });
  const [organization_id] = form.watch(["organization_id"]);

  const steps = [
    "Modelo e Orgão",
    "Propriedade",
    "Responsável e Configurações",
  ];

  useEffect(() => {
    if (checklist) {
      form.reset(checklist);
    }

    const getData = async () => {
      const [models, organizations, users] = await Promise.all([
        api.get("/api/v1/models?per_page=100"),
        api.get("/api/v1/organizations?per_page=100"),
        api.get("/api/v1/users?per_page=100&role=evaluator"),
      ]);

      setModels(models.data.data);
      setOrganizations(organizations.data.data);
      setUsers(users.data.data);
    };
    getData();
  }, [checklist]);

  const fetchProperties = useCallback(
    async (organizationId: string, filter?: string) => {
      if (!organizationId) return;

      setLoadingProperties(true);
      try {
        const params = new URLSearchParams({
          organization_id: organizationId,
          per_page: "20",
        });

        if (filter?.trim()) {
          params.append("name", filter.trim());
        }

        const response = await api.get(
          `/api/v1/properties?${params.toString()}`
        );
        setProperties(response.data.data);
        setPropertiesMeta(response.data.meta);
      } catch (error) {
        console.error("Erro ao carregar propriedades:", error);
        setProperties([]);
      } finally {
        setLoadingProperties(false);
      }
    },
    []
  );

  // Debounce para filtro
  useEffect(() => {
    if (!organization_id) {
      setProperties([]);
      return;
    }

    // Se não há filtro, carrega imediatamente
    if (!propertyFilter?.trim()) {
      fetchProperties(organization_id);
      return;
    }

    // Se há filtro, aplica debounce
    const timeoutId = setTimeout(() => {
      fetchProperties(organization_id, propertyFilter);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [organization_id, propertyFilter, fetchProperties]);

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          form.getValues("model_id") && form.getValues("organization_id")
        );
      case 2:
        return !!form.getValues("property_id");
      case 3:
        return !!form.getValues("user_id");
      default:
        return false;
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof z.infer<typeof formSchema>)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = ["model_id", "organization_id"];
        break;
      case 2:
        fieldsToValidate = ["property_id"];
        break;
      case 3:
        fieldsToValidate = ["user_id"];
        break;
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid && validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (checklist) {
      return api
        .put("/api/v1/checklists/" + checklist.id, {
          user_id: values.user_id,
        })
        .then(() =>
          router.navigate({
            to: "/checklists",
          })
        )
        .catch((e) => console.log(e));
    }

    return api
      .post("/api/v1/checklists/", values)
      .then(() =>
        router.navigate({
          to: "..",
          search: {
            refresh: Date.now(),
          },
        })
      )
      .catch((e) => console.log(e));
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              disabled={!!checklist}
              name="model_id"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Modelo</FormLabel>
                  <Select onValueChange={field.onChange} {...field}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o Modelo do checklist" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {models?.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              disabled={!!checklist}
              name="organization_id"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Orgão</FormLabel>
                  <Select onValueChange={field.onChange} {...field}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o Orgão" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {organizations.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              disabled={!!checklist}
              name="property_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Selecione o Imóvel</FormLabel>

                  {/* Filtro de pesquisa */}
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Pesquisar por nome, endereço ou responsável..."
                        value={propertyFilter}
                        onChange={(e) => setPropertyFilter(e.target.value)}
                        className="pl-9"
                        disabled={!form.getValues("organization_id")}
                      />
                      {loadingProperties && propertyFilter && (
                        <div className="absolute right-3 top-3">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                        </div>
                      )}
                    </div>

                    {propertiesMeta?.total > 0 && (
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                          {propertyFilter
                            ? `${propertiesMeta?.total} propriedades encontradas`
                            : `${propertiesMeta?.total} propriedades disponíveis`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Botão para criar nova propriedade */}
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      disabled={!form.getValues("organization_id")}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        router.navigate({
                          to: `/properties/create?organization_id=${form.getValues("organization_id")}`,
                        });
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Nova Propriedade
                    </Button>
                  </div>

                  {/* Lista de propriedades */}
                  {loadingProperties ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        Carregando propriedades...
                      </p>
                    </div>
                  ) : !form.getValues("organization_id") ? (
                    <div className="text-center py-8">
                      <Building className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Selecione um órgão no passo anterior para visualizar as
                        propriedades
                      </p>
                    </div>
                  ) : properties.length === 0 ? (
                    <div className="text-center py-8">
                      <Building className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-2">
                        {propertyFilter
                          ? "Nenhuma propriedade encontrada"
                          : "Nenhuma propriedade cadastrada"}
                      </p>
                      {propertyFilter && (
                        <p className="text-sm text-muted-foreground">
                          Tente ajustar os termos da pesquisa
                        </p>
                      )}
                    </div>
                  ) : (
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="space-y-3 grid grid-cols-2"
                      >
                        {properties.map((property) => (
                          <div key={property.id} className="relative">
                            <RadioGroupItem
                              value={String(property.id)}
                              id={`property-${property.id}`}
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor={`property-${property.id}`}
                              className="flex cursor-pointer"
                            >
                              <Card className="w-full peer-checked:ring-2 peer-checked:ring-primary peer-checked:border-primary transition-all hover:bg-muted/50">
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1 space-y-2 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                        <h4 className="font-medium truncate">
                                          {property.name}
                                        </h4>
                                      </div>

                                      {property.address && (
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                          📍 {property.address}
                                          {property.city &&
                                            property.state &&
                                            `, ${property.city} - ${property.state}`}
                                        </p>
                                      )}

                                      {property.responsible?.name && (
                                        <p className="text-sm text-muted-foreground truncate">
                                          👤 Responsável:{" "}
                                          {property.responsible.name}
                                        </p>
                                      )}

                                      <div className="flex flex-wrap gap-2">
                                        {property.type && (
                                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-md">
                                            {property.type}
                                          </span>
                                        )}

                                        {property.status && (
                                          <span
                                            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md ${
                                              property.status === "active"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-gray-100 text-gray-800"
                                            }`}
                                          >
                                            {property.status === "active"
                                              ? "Ativo"
                                              : property.status}
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    <div className="ml-4 flex-shrink-0">
                                      <div
                                        className={`w-4 h-4 border rounded-full flex items-center justify-center transition-colors ${
                                          field.value === String(property.id)
                                            ? "bg-primary border-primary"
                                            : "border-muted-foreground"
                                        }`}
                                      >
                                        {field.value ===
                                          String(property.id) && (
                                          <div className="w-2 h-2 bg-white rounded-full" />
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 3:
        return (
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="user_id"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Responsável pelo Checklist</FormLabel>
                  <Select onValueChange={field.onChange} {...field}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o Responsável pelo checklist" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_returned"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>É um Checklist de Retorno?</FormLabel>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant={field.value ? "default" : "outline"}
                      onClick={() => field.onChange(true)}
                    >
                      Sim
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === false ? "default" : "outline"}
                      onClick={() => field.onChange(false)}
                    >
                      Não
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("is_returned") && (
              <FormField
                control={form.control}
                name="return"
                defaultValue={1}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Qual retorno?</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="Informe o número do checklist de retorno"
                        className="input input-bordered w-full"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Criar Novo Checklist</CardTitle>
            <Steps currentStep={currentStep} steps={steps} />
          </CardHeader>

          <CardContent>
            <StepContent>{renderStepContent()}</StepContent>

            <StepActions>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.navigate({ to: "/checklists" })}
                >
                  Cancelar
                </Button>
                {currentStep > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Anterior
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                {currentStep < steps.length && (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!validateStep(currentStep)}
                  >
                    Próximo
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
                {currentStep === steps.length && (
                  <Button type="submit" disabled={!form.formState.isValid}>
                    <Save className="mr-2 h-4 w-4" />
                    {checklist ? "Salvar Checklist" : "Criar Checklist"}
                  </Button>
                )}
              </div>
            </StepActions>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
