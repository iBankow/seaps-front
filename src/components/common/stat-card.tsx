import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const TONE_CLASS = {
  primary: "text-primary",
  success: "text-success",
  destructive: "text-destructive",
  warning: "text-warning-foreground",
  validated: "text-validated",
  muted: "text-muted-foreground",
} as const;

export type StatCardTone = keyof typeof TONE_CLASS;

export interface StatCardProps {
  /** Mono uppercase label above the figure. */
  title: string;
  /** Main figure. `undefined` renders the "--" placeholder. */
  value: number | string | undefined;
  /** Short qualifier rendered beside the figure. */
  hint?: string;
  tone?: StatCardTone;
  /** Optional slot below the figure — a progress bar, legend, etc. */
  children?: ReactNode;
  className?: string;
}

/**
 * KPI tile from the "Painel SIMP" design: mono uppercase label, oversized
 * Archivo figure tinted by tone, optional hint. Used by the dashboard and by
 * the checklist/property detail screens.
 */
export function StatCard({
  title,
  value,
  hint,
  tone = "primary",
  children,
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "gap-3 p-[18px_18px_16px] shadow-[0_1px_2px_rgba(16,32,77,.05)]",
        className,
      )}
    >
      <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
        {title}
      </span>
      <div className="flex items-end gap-2">
        <span
          className={cn(
            "font-heading text-[34px] leading-none font-bold tracking-tight",
            TONE_CLASS[tone],
          )}
        >
          {value !== undefined ? value : "--"}
        </span>
        {hint && (
          <span className="pb-1 text-[11px] text-muted-foreground">{hint}</span>
        )}
      </div>
      {children}
    </Card>
  );
}
