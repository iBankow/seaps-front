import api from "@/lib/http";
import type { PaginatedResponse } from "@/types";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { User, UserUpdatePayload, UsersListParams } from "../types";
import { usersKeys } from "./query-keys";

export const useUsersList = (filters?: UsersListParams) => {
  return useQuery({
    queryKey: usersKeys.list(filters),
    queryFn: () => usersApi.list(filters),
    placeholderData: keepPreviousData,
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: usersKeys.details(id),
    queryFn: () => usersApi.details(id),
    enabled: !!id,
  });
};

export const useUpdateUser = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UserUpdatePayload) => usersApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.all });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.all });
    },
  });
};

export const usersApi = {
  list: async (filters?: UsersListParams) => {
    const { data } = await api.get<PaginatedResponse<User>>("/users", {
      params: { ...filters },
    });

    return data;
  },
  details: async (id: string) => {
    const { data } = await api.get<User>(`/users/${id}`);

    return data;
  },
  update: async (id: string, payload: UserUpdatePayload) => {
    const { data } = await api.put<User>(`/users/${id}`, payload);

    return data;
  },
  delete: async (id: string) => {
    await api.delete(`/users/${id}`, { skipErrorToast: true });
  },
};
