import { Badge } from "@/components/ui/badge";

export const ClassificationBadge = ({
  classification,
}: {
  classification: number;
}) => {
  const badge = {
    label: "",
    style: "",
  };

  switch (classification) {
    case 0:
      badge.label = "RUIM";
      badge.style = "bg-destructive text-destructive-foreground hover:opacity-80";
      break;
    case 1:
      badge.label = "REGULAR";
      badge.style = "bg-warning text-warning-foreground hover:opacity-80";
      break;
    case 2:
      badge.label = "BOM";
      badge.style = "bg-success text-success-foreground hover:opacity-80";
      break;
    default:
      badge.label = "ABERTO";
      badge.style = "bg-primary text-primary-foreground hover:opacity-80";
  }

  return <Badge className={badge.style}>{badge.label}</Badge>;
};
