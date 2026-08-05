import api from "@/lib/http";
import { initialData, type PaginatedResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface Organization {
  id: string;
  name: string;
  acronym: string;
}

export const useOrganizationsList = () => {
  return useQuery({
    queryKey: ["organizations"],
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
