import type { PaginatedParams } from "@/types";

export interface ModelItem {
  id: string;
  name: string;
}

export interface Model {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  items: ModelItem[];
  items_count?: number;
}

export type ModelsListParams = PaginatedParams;

export interface ModelPayload {
  name: string;
  description?: string;
  items: { name: string }[];
}
