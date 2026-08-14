import { Badge } from "@/components/ui/badge";

export const ClassificationBadge = ({
  classification,
}: {
  classification: number;
}) => {
  const badge = (() => {
    switch (classification) {
      case 0:
        return { label: "RUIM", variant: "destructive" as const };
      case 1:
        return { label: "REGULAR", variant: "warning" as const };
      case 2:
        return { label: "BOM", variant: "success" as const };
      default:
        return { label: "ABERTO", variant: "default" as const };
    }
  })();

  return <Badge variant={badge.variant}>{badge.label}</Badge>;
};
