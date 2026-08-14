import { Badge, type badgeVariants } from "@/components/ui/badge";
import type { VariantProps } from "class-variance-authority";
import { getStatusTone } from "./status-colors";

const STATUS_LABEL: Record<string, string> = {
  OPEN: "ABERTO",
  CLOSED: "FECHADO",
  REJECTED: "REJEITADO",
  APPROVED: "APROVADO",
};

const TONE_VARIANT: Record<string, VariantProps<typeof badgeVariants>["variant"]> = {
  success: "success",
  destructive: "destructive",
  muted: "outline",
  primary: "default",
  purple: "purple",
};

export const StatusBadge = ({ status }: { status: string }) => {
  const label = STATUS_LABEL[status] ?? "ABERTO";
  const variant = TONE_VARIANT[getStatusTone(status)];

  return <Badge variant={variant} className="leading-0">{label}</Badge>;
};
