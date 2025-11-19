/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "knex";

type SearchParams = {
  [key: string]: string | string[] | undefined | boolean | SearchParams;
};

interface IChecklistSearchParams {
  page?: number;
  per_page?: number;
  organization?: string;
  user?: string;
  status?: string;
  property_name?: string;
}

interface IPaginateParams {
  perPage: number;
  currentPage: number;
}

interface IPagination<Data> {
  data: Data[];
  meta: IBasePagination;
}

interface IBasePagination {
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
  prev_page: number;
  next_page: number;
}

declare module "knex" {
  namespace Knex {
    interface QueryBuilder<TRecord extends object = any, TResult = any> {
      paginate(
        page: number,
        perPage: number,
        options?: { nest?: boolean }
      ): Knex.QueryBuilder<TRecord, IPagination<TRecord[]>>;
    }
    interface QueryBuilder<TRecord extends object = any, TResult = any> {
      paginate<T = any>(
        page: number,
        perPage: number,
        options?: { nest?: boolean }
      ): Knex.QueryBuilder<TRecord, IPagination<T>>;
    }
    interface QueryBuilder<TRecord extends object = any, TResult = any> {
      nest(): QueryBuilder<TRecord, TResult>;
    }
  }
}

interface ChecklistItem {
  id: string;
  checklist_id: string;
  score?: number;
  image?: string;
  observation?: string;
  is_valid?: boolean | null;
  item: {
    name: string;
    level: number;
  };
  images: {
    id: string;
    url: string;
    image: string;
    name: string;
  }[];
}

interface Checklist {
  id: string;
  sid: string;
  status: string;
  score: number;
  classification?: number;
  property: {
    id: string;
    address: string;
    name: string;
  };
  organization: {
    id: string;
    name: string;
  };
  user?: {
    id: string;
    name: string;
  };
  created_at: string;
  finished_at?: string;
}

interface Property {
  id: string;
  organization_id: string;
  person_id?: string;
  created_by?: string;
  type: "OWN" | "RENTED" | "LEASED";
  name: string;
  name_normalized?: string;
  address?: string;
  cep?: string;
  state?: string;
  city?: string;
  neighborhood?: string;
  street?: string;
  coordinates?: string;
  is_deleted?: boolean;
  created_at: string;
  updated_at?: string;
  organization: {
    id: string;
    name: string;
  };
  person?: {
    id: string;
    name: string;
  };
  user?: {
    id: string;
    name: string;
  };
}

interface IPropertySearchParams {
  page?: number;
  per_page?: number;
  organization?: string;
  type?: string;
  city?: string;
  state?: string;
  name?: string;
}
