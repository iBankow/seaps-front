import api from "@/lib/http";
import type { PaginatedResponse } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsKeys } from "./query-keys";
import type {
  Notification,
  NotificationListParams,
  UnreadCountResponse,
} from "./types";

export const useNotificationsList = (
  filters?: NotificationListParams,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: notificationsKeys.list(filters),
    queryFn: () => notificationsApi.list(filters),
    enabled: options?.enabled,
  });
};

export const useUnreadNotificationsCount = () => {
  return useQuery({
    queryKey: notificationsKeys.unreadCount(),
    queryFn: () => notificationsApi.unreadCount(),
    refetchInterval: 30000,
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
    },
  });
};

export const notificationsApi = {
  list: async (filters?: NotificationListParams) => {
    const { data } = await api.get<PaginatedResponse<Notification>>(
      "/notifications",
      { params: filters },
    );

    return data;
  },
  unreadCount: async () => {
    const { data } = await api.get<UnreadCountResponse>(
      "/notifications/unread-count",
    );

    return data;
  },
  markAsRead: async (id: string) => {
    const { data } = await api.patch<Notification>(
      `/notifications/${id}/read`,
    );

    return data;
  },
  markAllAsRead: async () => {
    await api.patch("/notifications/read-all");
  },
};
