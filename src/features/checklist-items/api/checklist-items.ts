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

export const useChecklistItem = (id?: string, initialData?: ChecklistItem) => {
  return useQuery({
    queryKey: checklistItemsKeys.details(id),
    queryFn: () => checklistItemsApi.details(id!),
    enabled: !!id,
    initialData,
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

export const useUpdateChecklistItem = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<Pick<ChecklistItem, "observation" | "score">>) =>
      checklistItemsApi.update(id, payload),
    // Fixa o item desta chamada. Os callbacks do TanStack Query rodam com as
    // options do render mais recente, então trocar de item antes do PUT
    // responder faria a resposta do item antigo cair no cache do item novo.
    onMutate: () => ({ targetId: id }),
    onSuccess: (data, _payload, context) => {
      const targetId = context?.targetId ?? data.id;
      const key = checklistItemsKeys.details(targetId);

      // Merge em vez de replace: a resposta do PUT pode não trazer as relações
      // (item, images), e substituir apagaria o nome do item na tela.
      const previous = queryClient.getQueryData<ChecklistItem>(key);
      const merged = previous ? { ...previous, ...data } : data;

      queryClient.setQueryData(key, merged);

      if (merged.checklist_id) {
        queryClient.invalidateQueries({
          queryKey: checklistItemsKeys.list(merged.checklist_id),
        });
      }
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
  update: async (
    id: string,
    payload: Partial<Pick<ChecklistItem, "observation" | "score">>,
  ) => {
    const { data } = await api.put<ChecklistItem>(
      `/checklist-items/${id}`,
      payload,
    );

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
