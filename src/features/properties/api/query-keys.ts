import type { PropertiesListParams } from "../types";

export const propertiesKeys = {
  all: ["properties"] as const,
  list: (filters?: PropertiesListParams) =>
    [...propertiesKeys.all, "list", filters] as const,
  details: (id: string) => [...propertiesKeys.all, "details", id] as const,
};
