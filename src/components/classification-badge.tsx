import { Badge } from "./ui/badge";

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
      badge.style =
        "border-red-800 bg-red-200 text-red-900 hover:bg-red-200/80";
      break;
    case 1:
      badge.label = "REGULAR";
      badge.style =
        "border-yellow-800 bg-yellow-200 text-yellow-900 hover:bg-yellow-200/80";
      break;
    case 2:
      badge.label = "BOM";
      badge.style =
        "border-green-800 bg-green-200 text-green-900 hover:bg-green-200/80";
      break;
    default:
      badge.label = "ABERTO";
      badge.style = "border-blue-800 bg-blue-500 hover:bg-blue-500/80";
  }

  return <Badge className={badge.style}>{badge.label}</Badge>;
};
