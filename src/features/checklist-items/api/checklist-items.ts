import api from "@/lib/http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { checklistItemsKeys } from "./query-keys";
import type { ChecklistItem } from "../types";

export const useChecklistsItems = (id?: string) => {
  return useQuery({
    queryKey: checklistItemsKeys.list(id),
    queryFn: () => checklistItemsApi.list(id),
    initialData: [],
  });
};

export const useChecklistItem = (id?: string) => {
  return useQuery({
    queryKey: checklistItemsKeys.details(id),
    queryFn: () => checklistItemsApi.details(id!),
    enabled: !!id,
  });
};

export const useUploadChecklistItemImages = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (files: FormData) => checklistItemsApi.uploadImages(id, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: checklistItemsKeys.details(id) });
    },
  });
};

export const useDeleteChecklistItemImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      checklistItemId,
      imageId,
    }: {
      checklistItemId: string;
      imageId: string;
    }) => checklistItemsApi.deleteImage(checklistItemId, imageId),
    onSuccess: (_data, { checklistItemId }) => {
      queryClient.invalidateQueries({
        queryKey: checklistItemsKeys.details(checklistItemId),
      });
    },
  });
};

export const checklistItemsApi = {
  list: async (id?: string) => {
    const { data } = await api.get<Array<ChecklistItem>>(
      `/checklists/${id}/items`,
    );

    return data;
  },
  details: async (id: string) => {
    const { data } = await api.get<ChecklistItem>(`/checklist-items/${id}`);

    return data;
  },
  uploadImages: async (id: string, files: FormData) => {
    // Sem Content-Type manual: o axios define multipart com boundary
    // sozinho para FormData.
    const { data } = await api.post(`/checklist-items/${id}/upload`, files, {
      skipErrorToast: true,
    });

    return data;
  },
  deleteImage: async (checklistItemId: string, imageId: string) => {
    const { data } = await api.delete(
      `/checklist-items/${checklistItemId}/images/${imageId}`,
    );

    return data;
  },
};
