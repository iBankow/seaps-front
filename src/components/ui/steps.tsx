import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepsProps {
  currentStep: number;
  steps: string[];
  className?: string;
}

function Steps({ currentStep, steps, className }: StepsProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
                    {
                      "border-primary bg-primary text-primary-foreground":
                        isActive || isCompleted,
                      "border-muted-foreground/30 bg-muted text-muted-foreground":
                        isUpcoming,
                    }
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{stepNumber}</span>
                  )}
                </div>
                <div className="mt-2 text-center max-w-20">
                  <div
                    className={cn("text-xs md:text-sm font-medium", {
                      "text-primary": isActive || isCompleted,
                      "text-muted-foreground": isUpcoming,
                    })}
                  >
                    {step}
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn("h-px flex-1 mx-2 md:mx-4 mt-5", {
                    "bg-primary": stepNumber < currentStep,
                    "bg-muted-foreground/30": stepNumber >= currentStep,
                  })}
                />
              )}
            </React.Fragment>
          );
        })}
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
