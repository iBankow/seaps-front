import type { NotificationListParams } from "./types";

export const notificationsKeys = {
  all: ["notifications"] as const,
  list: (filters?: NotificationListParams) =>
    [...notificationsKeys.all, "list", filters] as const,
  unreadCount: () => [...notificationsKeys.all, "unread-count"] as const,
};
