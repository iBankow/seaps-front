import { useEffect, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/layout/page-header";
import { SectionLabel } from "@/components/common/section-label";
import { cn } from "@/lib/utils";
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

  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="flex flex-1 flex-col gap-3.5">
      <PageHeader
        eyebrow={`Checklists · Etapa ${currentStep}/${steps.length}`}
        title="Novo Checklist"
      >
        <Button variant="outline" asChild>
          <Link to="/checklists">
            <ChevronLeft />
            Cancelar
          </Link>
        </Button>
      </PageHeader>

      <Link
        to="/checklists"
        className="font-heading inline-block text-[10px] font-semibold tracking-[0.11em] text-primary uppercase hover:text-primary/80"
      >
        ← voltar para checklists
      </Link>

      {/* Trilha de etapas */}
      <Card className="gap-4 p-[20px_22px]">
        <SectionLabel hint={`${currentStep}/${steps.length}`}>
          {steps[currentStep - 1].name}
        </SectionLabel>

        <div
          className="flex w-full items-stretch gap-2 overflow-x-auto"
          ref={ref}
          style={{ scrollbarWidth: "none" }}
        >
          {steps.map((step) => {
            const isDone = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <button
                key={step.id}
                type="button"
                disabled={currentStep < step.id}
                onClick={() => setCurrentStep(step.id)}
                className={cn(
                  "flex min-w-fit flex-1 cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2 text-start transition-colors",
                  isCurrent ? "bg-secondary" : "hover:bg-secondary/60",
                  "disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-transparent",
                )}
              >
                <span
                  className={cn(
                    "font-mono flex h-9 w-9 min-w-9 items-center justify-center rounded-full border text-[12px]",
                    isDone && "border-primary bg-primary text-primary-foreground",
                    isCurrent && "border-primary text-primary",
                    !isDone && !isCurrent && "border-input text-muted-foreground",
                  )}
                >
                  {isDone ? <Check className="h-4 w-4" /> : step.id}
                </span>

                <span className="min-w-0 text-nowrap">
                  <span
                    className={cn(
                      "font-heading block text-[11px] font-semibold tracking-[0.09em] uppercase",
                      isCurrent || isDone ? "text-primary" : "",
                    )}
                  >
                    {step.name}
                  </span>
                  <span className="block text-[11px] text-muted-foreground">
                    {step.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <Progress value={progress} tone="success" className="h-2" />
      </Card>

      {/* Conteúdo da etapa */}
      <form
        id="checklist-form"
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {renderStepContent()}
        {currentStep === steps.length && (
          <div className="mt-3.5 flex justify-center">
            <Button
              type="submit"
              className="w-full max-w-3xl"
              size="lg"
              disabled={createChecklist.isPending}
            >
              {createChecklist.isPending
                ? "Criando Checklist..."
                : "Criar Checklist"}
              <Save />
            </Button>
          </div>
        )}
      </form>

      {/* Navegação */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          type="button"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ChevronLeft />
          Anterior
        </Button>

        {currentStep < steps.length && (
          <Button type="button" onClick={nextStep} disabled={!canProceed()}>
            Próximo
            <ChevronRight />
          </Button>
        )}
      </div>
    </div>
  );
}
