import type { PaginatedParams } from "@/types";

export type UserRole = "ADMIN" | "MANAGER" | "EVALUATOR" | "USER";

export interface User {
  id: string;
  name: string;
  email: string;
  permissions: string[];
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  organization?: {
    id: string;
    name: string;
    acronym?: string;
  };
}

export interface UsersListParams extends PaginatedParams {
  organization?: string;
  role?: string;
  name?: string;
  email?: string;
}

export interface UserUpdatePayload {
  permissions?: string[];
  is_active: boolean;
  organization_id?: string | null;
}

export type UserRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface UserRequest {
  id: string;
  user_name: string;
  user_email: string;
  user_cpf?: string;
  organization_name: string;
  organization_acronym: string;
  justification: string;
  status: UserRequestStatus;
  rejection_reason?: string;
  reviewed_by?: string;
  reviewer_name?: string;
  created_at: string;
  updated_at: string;
}

export interface UserRequestsListParams extends PaginatedParams {
  organization?: string;
  status?: string;
  user_name?: string;
}

export interface ReviewUserRequestPayload {
  id: string;
  status: Extract<UserRequestStatus, "APPROVED" | "REJECTED">;
  permissions?: string[];
  rejection_reason?: string;
}
