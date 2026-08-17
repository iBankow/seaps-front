import type { PaginatedParams } from "@/types";

export type NotificationLevel = "INFO" | "SUCCESS" | "WARNING" | "ERROR";

export type NotificationCategory = "SYSTEM" | "CHECKLIST" | "USER_REQUEST";

export interface Notification {
  id: string;
  title: string;
  message: string;
  level: NotificationLevel;
  category: NotificationCategory;
  action_url: string | null;
  metadata: Record<string, unknown> | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export type NotificationListParams = PaginatedParams;

export interface UnreadCountResponse {
  unread_count: number;
}
