import type { UsersListParams } from "../types";

export const usersKeys = {
  all: ["users"] as const,
  list: (filters?: UsersListParams) =>
    [...usersKeys.all, "list", filters] as const,
  details: (id: string) => [...usersKeys.all, "details", id] as const,
};
