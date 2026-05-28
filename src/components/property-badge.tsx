import { Badge } from "./ui/badge";

export const PropertyBadge = ({ type }: { type: string }) => {
  let className = "";
  let label = "";

  switch (type) {
    case "OWN":
      className =
        "border-blue-800 bg-blue-200 text-blue-900 hover:bg-blue-200/80";
      label = "PRÓPRIO";
      break;
    case "RENTED":
      className =
        "border-yellow-800 bg-yellow-200 text-yellow-900 hover:bg-yellow-200/80";
      label = "ALUGADO";
      break;

    case "GRANT":
      className = "border-red-800 bg-red-200 text-red-900 hover:bg-red-200/80";
      label = "CONCESSÃO";
      break;
    case "PRIVATE":
      className =
        "border-green-800 bg-green-200 text-green-900 hover:bg-green-200/80";
      label = "PRIVADO";
      break;
    default:
      className =
        "border-gray-800 bg-gray-200 text-gray-900 hover:bg-gray-200/80";
      label = type.toUpperCase();
      break;
  }

  return <Badge className={className}>{label}</Badge>;
};
