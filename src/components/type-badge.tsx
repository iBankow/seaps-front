import type { PropertyType } from "#/features/properties/types";
import { Badge } from "./ui/badge";

export const PROPERTY_TYPE_META: Record<
  PropertyType,
  { label: string; badgeClassName: string }
> = {
  OWN: {
    label: "PRÓPRIO",
    badgeClassName: "border-blue-800 bg-blue-100 text-blue-900",
  },
  RENTED: {
    label: "ALUGADO",
    badgeClassName: "border-green-800 bg-green-100 text-green-900",
  },
  GRANT: {
    label: "CEDIDO",
    badgeClassName: "border-purple-800 bg-purple-100 text-purple-900",
  },
};

export const TypeBadge = ({ type }: { type: string }) => {
  const badge = {
    label: "",
    style: "",
  };

  switch (type) {
    case "OWN":
      badge.label = "PRÓPRIO";
      badge.style = "border-blue-800 bg-blue-100 text-blue-900";
      break;
    case "RENTED":
      badge.label = "ALUGADO";
      badge.style = "border-green-800 bg-green-100 text-green-900";
      break;
    case "GRANT":
      badge.label = "CEDIDO";
      badge.style = "border-purple-800 bg-purple-100 text-purple-900";
      break;
    default:
      badge.label = "PRÓPRIO";
      badge.style = "border-blue-800 bg-blue-100 text-blue-900";
  }

  return <Badge className={badge.style}>{badge.label}</Badge>;
};
