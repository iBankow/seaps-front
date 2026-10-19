import api from "@/lib/http";
import type { PaginatedResponse } from "@/types";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { checklistsKeys } from "./query-keys";
import type {
  ChecklistCreatePayload,
  ChecklistDetail,
  ChecklistListItem,
  ChecklistListParams,
} from "../types/types";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useChecklistsList = (filters?: ChecklistListParams) => {
  return useQuery({
    queryKey: checklistsKeys.list(filters),
    queryFn: () => checklistsApi.list(filters),
    placeholderData: keepPreviousData,
  });
};

export const useChecklistDetail = (id: string) => {
  return useQuery({
    queryKey: checklistsKeys.details(id),
    queryFn: () => checklistsApi.details(id),
    retry: false,
    retryDelay(_, error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        toast.error(
          error.response.data?.message || "Checklist não encontrado.",
          {
            description: error.response.data?.action,
          },
        );
      }
      return 0;
    },
  });
};

export const useCreateChecklist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<ChecklistCreatePayload, "id">) =>
      checklistsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: checklistsKeys.list() });
    },
  });
};

export const checklistsApi = {
  list: async (filters?: ChecklistListParams) => {
    const { data } = await api.get<PaginatedResponse<ChecklistListItem>>(
      "/checklists",
      {
        params: filters,
      },
    );

    return data;
  },
  details: async (id: string) => {
    // O toast do 404 é feito no retryDelay de useChecklistDetail.
    const { data } = await api.get<ChecklistDetail>(`/checklists/${id}`, {
      skipErrorToast: true,
    });

    return data;
  },
  create: async (payload: Omit<ChecklistCreatePayload, "id">) => {
    // O wizard exibe o erro via getErrorMessage().
    const { data } = await api.post<ChecklistCreatePayload>(
      "/checklists",
      payload,
      { skipErrorToast: true },
    );

    return data;
  },
};
