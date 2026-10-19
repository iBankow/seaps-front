import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface MetaFieldProps {
  /** Mono uppercase caption, e.g. "Responsável". */
  label: string;
  children: ReactNode;
  className?: string;
}

/**
 * Label/value pair from the "Painel SIMP" design: tiny mono uppercase caption
 * above the value. The detail screens are built almost entirely out of these.
 */
export function MetaField({ label, children, className }: MetaFieldProps) {
  return (
    <div className={cn("min-w-0", className)}>
      <div className="font-mono text-[9.5px] tracking-[0.12em] text-muted-foreground uppercase">
        {label}
      </div>
      <div className="mt-1.5 text-[13px] leading-snug">{children}</div>
    </div>
  );
}
