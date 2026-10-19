import type { ModelsListParams } from "../types";

export const modelsKeys = {
  all: ["models"] as const,
  list: (filters?: ModelsListParams) =>
    [...modelsKeys.all, "list", filters] as const,
  details: (id: string) => [...modelsKeys.all, "details", id] as const,
  items: () => [...modelsKeys.all, "items"] as const,
};
