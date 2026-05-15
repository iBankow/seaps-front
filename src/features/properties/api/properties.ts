import api, { type PaginatedResponse } from "#/lib/axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { Property } from "../types";

export const usePropertiesList = (filters: Record<string, any>) => {
  return useQuery({
    queryKey: ["properties", filters],
    queryFn: () => propertiesApi.list(filters),
    placeholderData: keepPreviousData,
  });
};

export const propertiesApi = {
  list: async (filters?: Record<string, any>) => {
    const { data } = await api.get<PaginatedResponse<Property>>("/properties", {
      params: {
        ...filters,
      },
    });
    return data;
  },
};
