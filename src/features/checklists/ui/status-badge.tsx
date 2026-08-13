import { Badge } from "@/components/ui/badge";
import { getStatusToneClass } from "./status-colors";

const STATUS_LABEL: Record<string, string> = {
  OPEN: "ABERTO",
  CLOSED: "FECHADO",
  REJECTED: "REJEITADO",
  APPROVED: "APROVADO",
};

export const StatusBadge = ({ status }: { status: string }) => {
  const label = STATUS_LABEL[status] ?? "ABERTO";
  const style =
    status === "APPROVED"
      ? "bg-purple-500 text-white hover:bg-purple-500/80"
      : `${getStatusToneClass(status)} hover:opacity-80`;

  return <Badge className={style}>{label}</Badge>;
};
