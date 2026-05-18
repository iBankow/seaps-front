import type { PersonsListParams } from "../types";

export const personsKeys = {
  all: ["persons"] as const,
  list: (filters?: PersonsListParams) =>
    [...personsKeys.all, "list", filters] as const,
};
