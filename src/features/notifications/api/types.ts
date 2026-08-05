import type { PaginatedParams } from "#/lib/axios";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
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
