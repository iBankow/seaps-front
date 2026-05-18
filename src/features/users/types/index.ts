import type { PaginatedParams } from "#/lib/axios";

export interface UsersListParams extends PaginatedParams {
  role?: string;
  email?: string;
  name?: string;
  organization_id?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  organization_id: string;
  permissions: Array<string>;
  is_active: boolean;
  is_validated: boolean;
  created_at: string;
  updated_at: string;
}
