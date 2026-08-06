import api from "@/lib/http";
import type { PaginatedResponse } from "@/types";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { Model, ModelItem, ModelsListParams, ModelPayload } from "../types";
import { modelsKeys } from "./query-keys";

export const useModelsList = (filters?: ModelsListParams) => {
  return useQuery({
    queryKey: modelsKeys.list(filters),
    queryFn: () => modelsApi.list(filters),
    placeholderData: keepPreviousData,
  });
};

export const useModel = (id: string) => {
  return useQuery({
    queryKey: modelsKeys.details(id),
    queryFn: () => modelsApi.details(id),
    enabled: !!id,
  });
};

export const useModelItemsCatalog = () => {
  return useQuery({
    queryKey: modelsKeys.items(),
    queryFn: () => modelsApi.listItems(),
  });
};

export const useCreateModel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ModelPayload) => modelsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: modelsKeys.all });
    },
  });
};

export const useUpdateModel = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ModelPayload) => modelsApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: modelsKeys.all });
    },
  });
};

export const modelsApi = {
  list: async (filters?: ModelsListParams) => {
    const { data } = await api.get<PaginatedResponse<Model>>("/models", {
      params: { ...filters },
    });

    return data;
  },
  details: async (id: string) => {
    const { data } = await api.get<Model>(`/models/${id}`);

    return data;
  },
  listItems: async () => {
    const { data } = await api.get<ModelItem[]>("/items");

    return data;
  },
  create: async (payload: ModelPayload) => {
    const { data } = await api.post<Model>("/models", payload);

    return data;
  },
  update: async (id: string, payload: ModelPayload) => {
    const { data } = await api.put<Model>(`/models/${id}`, payload);

    return data;
  },
};
