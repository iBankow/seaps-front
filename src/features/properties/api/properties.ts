import api, { type PaginatedResponse } from "#/lib/axios";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type {
  Property,
  PropertyCreatePayload,
  PropertiesListParams,
} from "../types";
import { propertiesKeys } from "./query-keys";

export const usePropertiesList = (filters?: PropertiesListParams) => {
  return useQuery({
    queryKey: propertiesKeys.list(filters),
    queryFn: () => propertiesApi.list(filters),
    placeholderData: keepPreviousData,
  });
};

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: propertiesKeys.details(id),
    queryFn: () => propertiesApi.details(id),
    enabled: !!id,
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PropertyCreatePayload) => propertiesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertiesKeys.all });
    },
  });
};

export const propertiesApi = {
  list: async (filters?: PropertiesListParams) => {
    const { data } = await api.get<PaginatedResponse<Property>>("/properties", {
      params: {
        ...filters,
      },
    });
    return data;
  },
  details: async (id: string) => {
    const { data } = await api.get<Property>(`/properties/${id}`);

    return data;
  },
  create: async (payload: PropertyCreatePayload) => {
    const { data } = await api.post<Property>("/properties", payload);

    return data;
  },
};
