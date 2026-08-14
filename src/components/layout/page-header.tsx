import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  /** Small mono uppercase label above the title, e.g. "Operação". */
  eyebrow?: string;
  title: string;
  /** Right-aligned controls — search input, "+ Novo" button, etc. */
  children?: ReactNode;
  className?: string;
}

/**
 * Per-page header bar: eyebrow + title on the left, primary actions on the
 * right. Matches the "Painel SIMP" design's header block (66px, Archivo
 * title, IBM Plex Mono eyebrow). Rendered directly by each page — no
 * context/portal involved.
 */
export function PageHeader({
  eyebrow,
  title,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex h-[66px] flex-wrap items-center gap-5 rounded-lg border border-border border-b-[3px] border-b-primary bg-card px-[30px]",
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow && (
          <div className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
            {eyebrow}
          </div>
        )}
        <h1 className="font-heading truncate text-[17px] leading-tight font-bold tracking-[0.03em] uppercase">
          {title}
        </h1>
      </div>
      {children && (
        <div className="ml-auto flex flex-wrap items-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
}
