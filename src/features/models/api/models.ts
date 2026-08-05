import api from "@/lib/http";
import type { PaginatedResponse } from "@/types";

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
