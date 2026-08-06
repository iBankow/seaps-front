import { useEffect, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DetailsForm } from "./details-form";
import { SelectPropertyForm } from "./select-property-form";
import { SelectUserForm } from "./select-user-form";
import { ReviewForm } from "./review-form";
import z from "zod";
import type { Property } from "@/features/properties";
import { Link, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { useCreateChecklist } from "../../api/checklists";

const steps = [
  { id: 1, name: "Modelo", description: "Modelo, Órgão e Retorno" },
  { id: 2, name: "Propriedade", description: "Selecionar propriedade" },
  {
    id: 3,
    name: "Responsável",
    description: "Selecionar responsável pelo checklist",
  },
  { id: 4, name: "Revisão", description: "Confirmar dados" },
];

const formSchema = z.object({
  model_id: z.uuid({
    message: "Selecione um modelo de checklist",
  }),
  organization_id: z.uuid({
    message: "Selecione o Orgão",
  }),
  property_id: z.uuid({
    message: "Selecione o Imóvel",
  }),
  user_id: z.uuid({
    message: "Selecione o Responsável pelo Checklist",
  }),
  is_returned: z.boolean({
    message: "Selecione se o checklist é de retorno",
  }),
  return: z.string().optional(),
});

export type FormSchemaType = z.infer<typeof formSchema>;

export type FormDataType = {
  model?: {
    id: string;
    name: string;
  };
  organization?: {
    id: string;
    name: string;
  };
  property?: Partial<Property>;
  user?: {
    id: string;
    name: string;
  };
};

export function CreateOrderWizard() {
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      model_id: "",
      organization_id: "",
      property_id: "",
      user_id: "",
      is_returned: false,
      return: "",
    },
  });

  const [formData, setFormData] = useState<FormDataType | null>(null);

  const updateFormData = (updates: Partial<FormDataType>) => {
    setFormData((prev) => (prev ? { ...prev, ...updates } : { ...updates }));
  };

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

  const data = form.watch();

  const isStepComplete = (stepId: number) => {
    switch (stepId) {
      case 1:
        const isReturnChecked = data.is_returned;

        if (isReturnChecked) {
          return data.model_id && data.organization_id && data.return;
        }

        return (
          data.model_id &&
          data.organization_id &&
          data.is_returned !== undefined
        );
      case 2:
        return data.property_id !== "";
      case 3:
        return data.user_id !== "";
      case 4:
        return true;
      default:
        return false;
    }
  };

  const canProceed = () => {
    return isStepComplete(currentStep);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <DetailsForm updateFormData={updateFormData} form={form} />;

      case 2:
        return (
          <SelectPropertyForm updateFormData={updateFormData} form={form} />
        );

      case 3:
        return <SelectUserForm updateFormData={updateFormData} form={form} />;

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

  const router = useRouter();

  const getErrorMessage = (error: unknown) => {
    const message =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || "Não foi possível criar o imóvel";

    return message;
  };

  const createChecklist = useCreateChecklist();

  const onSubmit = async (values: FormSchemaType) => {
    try {
      await createChecklist.mutateAsync({
        ...values,
        return: values.is_returned ? Number(values.return) : undefined,
      });

      toast.success("Checklist criado com sucesso");
      router.navigate({ to: "/checklists" });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-0">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Novo Checklist
                </h1>
                <p className="text-muted-foreground">
                  Etapa {currentStep} de {steps.length}:{" "}
                  {steps[currentStep - 1].name}
                </p>
              </div>
              <Button variant="outline">
                <Link to="/checklists" className="flex items-center gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  Cancelar
                </Link>
              </Button>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
              <div
                className="flex pb-4 items-center justify-between gap-4 overflow-auto md:gap-4 w-full"
                ref={ref}
                style={{
                  scrollbarWidth: "none",
                }}
              >
                {steps.map((step) => (
                  <button
                    className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 w-full flex-1"
                    key={step.id}
                    disabled={currentStep < step.id}
                    onClick={() => {
                      setCurrentStep(step.id);
                    }}
                  >
                    <div
                      key={step.id}
                      className="flex justify-start items-center"
                    >
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
                      <div className="ml-3 text-start text-nowrap">
                        <div className="text-sm font-medium">{step.name}</div>
                        <div className="text-muted-foreground text-xs">
                          {step.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="bg-muted h-2 w-full rounded-full">
                <div
                  className="h-2 rounded-full bg-linear-to-r from-blue-600 to-green-600 transition-all duration-500 ease-in-out"
                  style={{
                    width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Step Content */}
            <form
              id="checklist-form"
              className="mb-8"
              ref={formRef}
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {renderStepContent()}
              {currentStep === steps.length && (
                <div className="mt-6 flex justify-center">
                  <Button type="submit" className="w-full max-w-3xl" size="lg">
                    Criar Checklist <Save />
                  </Button>
                </div>
              )}
            </form>

            {/* Navigation */}
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
                <Button onClick={nextStep} disabled={!canProceed()}>
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
