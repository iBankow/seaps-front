import api from "@/lib/http";
import type { PaginatedResponse } from "@/types";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type {
  ReviewUserRequestPayload,
  UserRequest,
  UserRequestsListParams,
} from "../types";
import { userRequestsKeys } from "./query-keys";

export const useUserRequestsList = (filters?: UserRequestsListParams) => {
  return useQuery({
    queryKey: userRequestsKeys.list(filters),
    queryFn: () => userRequestsApi.list(filters),
    placeholderData: keepPreviousData,
  });
};

export const useReviewUserRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }: ReviewUserRequestPayload) =>
      userRequestsApi.updateStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userRequestsKeys.all });
    },
  });
};

export const userRequestsApi = {
  list: async (filters?: UserRequestsListParams) => {
    const { data } = await api.get<PaginatedResponse<UserRequest>>(
      "/user-requests",
      { params: { ...filters } },
    );

    return data;
  },
  updateStatus: async (
    id: string,
    payload: Omit<ReviewUserRequestPayload, "id">,
  ) => {
    const { data } = await api.patch<UserRequest>(
      `/user-requests/${id}/status`,
      payload,
      { skipErrorToast: true },
    );

    return data;
  },
};
