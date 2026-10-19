import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SectionLabelProps {
  children: ReactNode;
  /** Mono counter shown beside the caption, e.g. "3/10". */
  hint?: string;
  /** Trailing control, pushed to the far edge. */
  action?: ReactNode;
  className?: string;
}

/**
 * Mono uppercase caption that opens a section inside a detail card — the
 * "PONTUAÇÃO" / "IMAGENS" / "OBSERVAÇÕES" headings of the "Painel SIMP" design.
 */
export function SectionLabel({
  children,
  hint,
  action,
  className,
}: SectionLabelProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="font-mono text-[9.5px] tracking-[0.12em] text-muted-foreground uppercase">
        {children}
      </span>
      {hint && (
        <span className="font-mono text-[11px] text-muted-foreground">
          {hint}
        </span>
      )}
      {action && <div className="ml-auto">{action}</div>}
    </div>
  );
}
