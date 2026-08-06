import api from "@/lib/http";
import { initialData, type PaginatedResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { Organization } from "../types";
import { organizationsKeys } from "./query-keys";

export const useOrganizationsList = () => {
  return useQuery({
    queryKey: organizationsKeys.list(),
    queryFn: () => organizationsApi.list(),
    initialData,
  });
};

export const organizationsApi = {
  list: async () => {
    const { data } = await api.get<PaginatedResponse<Organization>>(
      "/organizations",
      {
        params: {
          page: 1,
          per_page: 100,
        },
      },
    );

    return data;
  },
};
