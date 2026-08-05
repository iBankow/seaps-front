import api, { type PaginatedResponse } from "#/lib/axios";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { checklistNotificationsKeys } from "./query-keys";
import type {
  ChecklistNotification,
  ChecklistNotificationListItem,
  ChecklistNotificationListParams,
} from "./types";

export const useChecklistNotificationsList = (
  filters?: ChecklistNotificationListParams,
) => {
  return useQuery({
    queryKey: checklistNotificationsKeys.list(filters),
    queryFn: () => checklistNotificationsApi.list(filters),
    placeholderData: keepPreviousData,
  });
};

export const useChecklistNotification = (checklistId: string) => {
  return useQuery({
    queryKey: checklistNotificationsKeys.byChecklist(checklistId),
    queryFn: () => checklistNotificationsApi.getByChecklistId(checklistId),
    retry: false,
  });
};

export const useGenerateChecklistNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (checklistId: string) =>
      checklistNotificationsApi.generate(checklistId),
    onSuccess: (data, checklistId) => {
      queryClient.setQueryData(
        checklistNotificationsKeys.byChecklist(checklistId),
        data,
      );
      queryClient.invalidateQueries({
        queryKey: checklistNotificationsKeys.list(),
      });
    },
  });
};

export const checklistNotificationsApi = {
  list: async (filters?: ChecklistNotificationListParams) => {
    const { data } = await api.get<
      PaginatedResponse<ChecklistNotificationListItem>
    >("/checklist-notifications", {
      params: filters,
    });

    return data;
  },
  getByChecklistId: async (
    checklistId: string,
  ): Promise<ChecklistNotification | null> => {
    try {
      const { data } = await api.get<ChecklistNotification>(
        `/checklist-notifications/${checklistId}`,
      );

      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return null;
      }

      throw error;
    }
  },
  generate: async (checklistId: string) => {
    const { data } = await api.post<ChecklistNotification>(
      "/checklist-notifications",
      { checklist_id: checklistId },
    );

    return data;
  },
};
