export const checklistItemsKeys = {
  all: ["checklistItems"] as const,
  list: (checklistId?: string) =>
    [...checklistItemsKeys.all, "list", checklistId] as const,
  details: (id?: string) => [...checklistItemsKeys.all, "details", id] as const,
};
