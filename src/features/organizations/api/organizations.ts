import api, { type PaginatedResponse } from "#/lib/axios";

interface Organization {
  id: string;
  name: string;
  acronym: string;
}

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
