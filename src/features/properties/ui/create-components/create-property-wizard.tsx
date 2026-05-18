import { useEffect, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Save } from "lucide-react";
import { Link, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import z from "zod";

import { Button } from "#/components/ui/button";
import { useCreateProperty } from "#/features/properties/api/properties";
import { AddressForm } from "./address-form";
import { DetailsForm } from "./details-form";
import { SelectPersonForm } from "./select-person-form";
import { ReviewForm } from "./review-form";

const steps = [
  { id: 1, name: "Detalhes", description: "Dados básicos do imóvel" },
  { id: 2, name: "Responsável", description: "Selecionar responsável" },
  { id: 3, name: "Endereço", description: "Localização do imóvel" },
  { id: 4, name: "Revisão", description: "Confirmar dados" },
];

const formSchema = z.object({
  name: z.string().min(1, { message: "Informe o nome do imóvel" }),
  type: z.string().min(1, { message: "Informe o tipo do imóvel" }),
  organization_id: z.uuid({ message: "Selecione a organização" }),
  person_id: z.uuid({ message: "Selecione o responsável" }),
  address: z.string().min(1, { message: "Informe o endereço" }).optional(),
  cep: z
    .string()
    .min(8, { message: "Informe um CEP com 8 dígitos" })
    .max(9, { message: "Informe um CEP com 8 dígitos" }),
  state: z.string().min(1, { message: "Selecione o estado" }),
  city: z.string().min(1, { message: "Selecione a cidade" }),
  neighborhood: z.string().min(1, { message: "Informe o bairro" }),
  street: z.string().min(1, { message: "Informe a rua" }),
  number: z.string().optional(),
});

export type PropertyFormSchemaType = z.infer<typeof formSchema>;

export type PropertyFormDataType = {
  organization?: {
    id: string;
    name: string;
  };
  person?: {
    id: string;
    name: string;
  };
};

export function CreatePropertyWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PropertyFormDataType | null>(null);

  const router = useRouter();
  const createProperty = useCreateProperty();

  const form = useForm<PropertyFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "",
      organization_id: "",
      person_id: "",
      address: "",
      cep: "",
      state: "MT",
      city: "",
      neighborhood: "",
      street: "",
      number: "",
    },
  });

  const updateFormData = (updates: Partial<PropertyFormDataType>) => {
    setFormData((prev) => (prev ? { ...prev, ...updates } : { ...updates }));
  };

  const data = form.watch();

  const isStepComplete = (stepId: number) => {
    switch (stepId) {
      case 1:
        return !!(data.name && data.type && data.organization_id);
      case 2:
        return !!data.person_id;
      case 3:
        return !!(
          data.cep &&
          data.state &&
          data.city &&
          data.neighborhood &&
          data.street &&
          data.address
        );
      case 4:
        return true;
      default:
        return false;
    }
  };

  const canProceed = () => isStepComplete(currentStep);

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getErrorMessage = (error: unknown) => {
    const message =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || "Não foi possível criar o imóvel";

    return message;
  };

  const onSubmit = async (values: PropertyFormSchemaType) => {
    try {
      await createProperty.mutateAsync({
        ...values,
        type: values.type as "OWN" | "RENTED" | "GRANT",
        cep: values.cep.replace(/\D/g, ""),
        number: values.number ? values.number : null,
      });

      toast.success("Imóvel criado com sucesso");
      router.navigate({ to: "/properties" });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <DetailsForm form={form} updateFormData={updateFormData} />;
      case 2:
        return <SelectPersonForm form={form} updateFormData={updateFormData} />;
      case 3:
        return <AddressForm form={form} />;
      case 4:
        return <ReviewForm form={form} formData={formData} />;
      default:
        return null;
    }
  };

  const ref = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({
        left:
          (ref.current.children[currentStep - 1] as HTMLElement)?.offsetLeft -
          30,
        behavior: "smooth",
      });
    }

    if (formRef.current) {
      document.documentElement.scrollTo({
        top: formRef.current.offsetTop - 20,
        behavior: "smooth",
      });
    }
  }, [currentStep]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-0">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Novo Imóvel
                </h1>
                <p className="text-muted-foreground">
                  Etapa {currentStep} de {steps.length}:{" "}
                  {steps[currentStep - 1].name}
                </p>
              </div>
              <Button variant="outline">
                <Link to="/properties" className="flex items-center gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  Cancelar
                </Link>
              </Button>
            </div>

            <div className="mb-8">
              <div
                className="flex items-center justify-between gap-4 overflow-auto pb-4 md:gap-4 w-full"
                ref={ref}
                style={{ scrollbarWidth: "none" }}
              >
                {steps.map((step) => (
                  <button
                    className="w-full flex-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    key={step.id}
                    disabled={currentStep < step.id}
                    onClick={() => setCurrentStep(step.id)}
                    type="button"
                  >
                    <div className="flex items-center justify-start">
                      <div
                        className={`flex h-10 w-10 min-w-10 items-center justify-center rounded-full border-2 ${
                          currentStep > step.id
                            ? "bg-primary border-primary text-primary-foreground"
                            : currentStep === step.id
                              ? "border-primary text-primary"
                              : "border-muted-foreground text-muted-foreground"
                        }`}
                      >
                        {currentStep > step.id ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <span>{step.id}</span>
                        )}
                      </div>
                      <div className="ml-3 text-nowrap text-start">
                        <div className="text-sm font-medium">{step.name}</div>
                        <div className="text-muted-foreground text-xs">
                          {step.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="bg-muted h-2 w-full rounded-full">
                <div
                  className="h-2 rounded-full bg-linear-to-r from-blue-600 to-green-600 transition-all duration-500 ease-in-out"
                  style={{
                    width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                  }}
                />
              </div>
            </div>

            <form
              id="property-form"
              className="mb-8"
              onSubmit={form.handleSubmit(onSubmit)}
              ref={formRef}
            >
              {renderStepContent()}
              {currentStep === 4 && (
                <div className="mt-6 flex justify-center">
                  <Button
                    type="submit"
                    className="w-full max-w-3xl"
                    size="lg"
                    disabled={createProperty.isPending}
                  >
                    {createProperty.isPending
                      ? "Criando Imóvel..."
                      : "Criar Imóvel"}
                    <Save />
                  </Button>
                </div>
              )}
            </form>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Anterior
              </Button>

              {currentStep < steps.length && (
                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  type="button"
                >
                  Próximo
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
