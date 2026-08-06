export {
  propertiesApi,
  useCreateProperty,
  useProperty,
  usePropertiesList,
} from "./api/properties";
export { propertiesKeys } from "./api/query-keys";

export type {
  PropertiesListParams,
  Property,
  PropertyCreatePayload,
  PropertyType,
} from "./types";

export { CreatePropertyWizard } from "./ui/create-components/create-property-wizard";

// `ui/properties-list.tsx` e `ui/list-components/*` ficam de fora de propósito:
// são forks degradados e sem importador — a versão viva está em
// `routes/_auth/properties/-components`. Expô-los aqui seria convidar o uso.
// Ver "Achados" no MIGRATION.md.
