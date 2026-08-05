import type { PaginatedParams } from "#/lib/axios";

export interface ChecklistNotification {
  id: string;
  checklist_id: string;
  organization_id: string;
  generated_by: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface ChecklistNotificationListItem extends ChecklistNotification {
  checklist: {
    sid: string;
    status: string;
  };
  organization: {
    name: string;
    acronym: string;
  };
  property: {
    name: string;
    city: string;
  };
  generated_by_user: {
    name: string;
  } | null;
}

export interface ChecklistNotificationListParams extends PaginatedParams {
  organization_id?: string;
  checklist_id?: string;
  property_name?: string;
  city?: string;
}
