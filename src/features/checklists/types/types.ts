import type { Property } from "@/features/properties/types";
import type { PaginatedParams } from "@/types";

export interface ChecklistListParams extends PaginatedParams {
  organization_id?: string;
  user_id?: string;
  status?: string;
  property_name?: string;
  city?: string;
}

export interface ChecklistListItem {
  id: string;
  sid: string;
  organization_id: string;
  model_id: string;
  property_id: string;
  user_id: string;
  score: number;
  classification: number;
  status: string;
  return: number;
  is_returned: boolean;
  is_deleted: boolean;
  finished_at: string;
  created_at: string;
  updated_at: string;
  validated_by: string | null;
  organization: {
    id: string;
    name: string;
    acronym: string;
  };
  user: {
    name: string;
  };
  property: Property;
}

export interface ChecklistDetail extends ChecklistListItem {
  user: {
    id: string;
    name: string;
  };
  validator: {
    id: string;
    name: string;
  };
}

export interface ChecklistCreatePayload {
  user_id: string;
  organization_id: string;
  model_id: string;
  property_id: string;
  is_returned?: boolean | undefined;
  return?: number | undefined;
}
