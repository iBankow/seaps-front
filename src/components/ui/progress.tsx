"use client";

import { Progress as ProgressPrimitive } from "@base-ui/react/progress";

import { cn } from "@/lib/utils";

const INDICATOR_TONE = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
} as const;

export type ProgressTone = keyof typeof INDICATOR_TONE;

// className styles the track (height, margins), as in the Radix version.
function Progress({
  className,
  value,
  tone = "primary",
  ...props
}: Omit<ProgressPrimitive.Root.Props, "className"> & {
  className?: string;
  tone?: ProgressTone;
}) {
  return (
    <ProgressPrimitive.Root
      value={value}
      data-slot="progress"
      className="w-full"
      {...props}
    >
      <ProgressPrimitive.Track
        data-slot="progress-track"
        className={cn(
          "relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted",
          className,
        )}
      >
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className={cn("h-full transition-all", INDICATOR_TONE[tone])}
        />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  );
}

export { Progress };
