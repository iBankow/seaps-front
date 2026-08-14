import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const TONE_CLASS = {
  primary: "text-primary",
  success: "text-success",
  destructive: "text-destructive",
  warning: "text-warning-foreground",
} as const;

export interface NumberCardProps {
  title: string;
  number: number | undefined;
  hint?: string;
  tone?: keyof typeof TONE_CLASS;
}

export function NumberCard({
  title,
  number,
  hint,
  tone = "primary",
}: NumberCardProps) {
  return (
    <Card className="gap-3 p-[18px_18px_16px] shadow-[0_1px_2px_rgba(16,32,77,.05)]">
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
          {number !== undefined ? number : "--"}
        </span>
        {hint && (
          <span className="pb-1 text-[11px] text-muted-foreground">
            {hint}
          </span>
        )}
      </div>
    </Card>
  );
}
