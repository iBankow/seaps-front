import api from "@/lib/http";
import { useQuery } from "@tanstack/react-query";
import { checklistItemsKeys } from "./query-keys";
import type { ChecklistItem } from "../types";

export const useChecklistsItems = (id?: string) => {
  return useQuery({
    queryKey: checklistItemsKeys.list(id),
    queryFn: () => checklistItemsApi.list(id),
    initialData: [],
  });
};

export const checklistItemsApi = {
  list: async (id?: string) => {
    const { data } = await api.get<Array<ChecklistItem>>(
      `/checklists/${id}/items`,
    );

    return data;
  },
};
