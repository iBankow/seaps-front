import api, { type PaginatedResponse } from "#/lib/axios";

interface Model {
  id: string;
  name: string;
}

export const modelsApi = {
  list: async () => {
    const { data } = await api.get<PaginatedResponse<Model>>("/models");

    return data;
  },
};
