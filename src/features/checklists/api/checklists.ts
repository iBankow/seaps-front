import api, { type PaginatedResponse } from "#/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { checklistsKeys } from "./query-keys";
import type {
  ChecklistCreatePayload,
  ChecklistDetail,
  ChecklistListItem,
  ChecklistListParams,
} from "../types/types";

export const useChecklistsList = (filters?: ChecklistListParams) => {
  return useQuery({
    queryKey: checklistsKeys.list(filters),
    queryFn: () => checklistsApi.list(filters),
  });
};

export const useChecklist = (id: string) => {
  return useQuery({
    queryKey: checklistsKeys.details(id),
    queryFn: () => checklistsApi.details(id),
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
    const { data } = await api.get<ChecklistDetail>(`/checklists/${id}`);

    return data;
  },
  create: async (payload: Omit<ChecklistCreatePayload, "id">) => {
    const { data } = await api.post<ChecklistCreatePayload>(
      "/checklists",
      payload,
    );

    return data;
  },
};
