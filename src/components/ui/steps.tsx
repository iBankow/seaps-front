import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepsProps {
  currentStep: number;
  steps: { id: number; name: string; description?: string }[];
  className?: string;
}

function Steps({ currentStep, steps, className }: StepsProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="mb-4 flex items-center justify-between">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
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
            <div className="ml-3">
              <div className="text-sm font-medium">{step.name}</div>
              {step.description && (
                <div className="text-muted-foreground text-xs">
                  {step.description}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="bg-muted h-2 w-full rounded-full">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-green-600 transition-all duration-500 ease-in-out"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}

interface StepContentProps {
  children: React.ReactNode;
  className?: string;
}

function StepContent({ children, className }: StepContentProps) {
  return <div className={cn("mt-8", className)}>{children}</div>;
}

interface StepActionsProps {
  children: React.ReactNode;
  className?: string;
}

function StepActions({ children, className }: StepActionsProps) {
  return (
    <div className={cn("mt-6 flex justify-between gap-2", className)}>
      {children}
    </div>
  );
}

export { Steps, StepContent, StepActions };
