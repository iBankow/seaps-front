import type { ChecklistNotificationListParams } from "./types";

export const checklistNotificationsKeys = {
  all: ["checklist-notifications"] as const,
  list: (filters?: ChecklistNotificationListParams) =>
    [...checklistNotificationsKeys.all, "list", filters] as const,
  byChecklist: (checklistId: string) =>
    [...checklistNotificationsKeys.all, "by-checklist", checklistId] as const,
};
