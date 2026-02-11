import { Badge } from "./ui/badge";

const PROPERTY_TYPE_ENUM = {
  OWN: {
    label: "PRÓPRIO",
    style: "border-blue-800 bg-blue-200 text-blue-900 hover:bg-blue-200/80",
  },
  RENTED: {
    label: "ALUGADO",
    style:
      "border-yellow-800 bg-yellow-200 text-yellow-900 hover:bg-yellow-200/80",
  },
  GRANT: {
    label: "CONCESSÃO",
    style: "border-red-800 bg-red-200 text-red-900 hover:bg-red-200/80",
  },
};

export const PropertyBadge = ({ type }: { type: string }) => {
  return (
    <Badge
      className={
        PROPERTY_TYPE_ENUM[type as keyof typeof PROPERTY_TYPE_ENUM].style
      }
    >
      {PROPERTY_TYPE_ENUM[type as keyof typeof PROPERTY_TYPE_ENUM].label}
    </Badge>
  );
};
