import type { PaginatedResponse } from "#/lib/axios";
import api from "#/lib/axios";
import { useQuery } from "@tanstack/react-query";
import type { User, UsersListParams } from "../types";
import { usersKeys } from "./query-keys";

export const useUsersList = (filters?: UsersListParams) => {
  return useQuery({
    queryKey: usersKeys.list(filters),
    queryFn: () => usersApi.list(filters),
  });
};

export const usersApi = {
  list: async (filters?: UsersListParams) => {
    const { data } = await api.get<PaginatedResponse<User>>("/users", {
      params: filters,
    });

    return data;
  },
  details: async (id: string) => {
    const { data } = await api.get<User>(`/users/${id}`);

    return data;
  },
};
