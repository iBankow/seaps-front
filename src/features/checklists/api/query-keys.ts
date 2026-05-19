import type { ChecklistListParams } from "../types/types";

export const checklistsKeys = {
  all: ["checklists"] as const,
  list: (filters?: ChecklistListParams) =>
    [...checklistsKeys.all, "list", filters] as const,
  details: (id: string) => [...checklistsKeys.all, "details", id] as const,
};
