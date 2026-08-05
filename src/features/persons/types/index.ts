import type { PaginatedParams } from "@/lib/axios";

export interface Person {
  id: string;
  organization_id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface PersonCreatePayload {
  organization_id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
}

export interface PersonsListParams extends PaginatedParams {
  name?: string;
  organization_id?: string;
}
