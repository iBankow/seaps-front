import type { UserRequestsListParams, UsersListParams } from "../types";

export const usersKeys = {
  all: ["users"] as const,
  list: (filters?: UsersListParams) =>
    [...usersKeys.all, "list", filters] as const,
  details: (id: string) => [...usersKeys.all, "details", id] as const,
};

export const userRequestsKeys = {
  all: ["user-requests"] as const,
  list: (filters?: UserRequestsListParams) =>
    [...userRequestsKeys.all, "list", filters] as const,
};
