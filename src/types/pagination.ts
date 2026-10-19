export interface PaginationMeta {
  current_page: number;
  last_page: number;
  next_page: string | null;
  per_page: number;
  prev_page: string | null;
  total: number;
}

export interface PaginatedResponse<T> {
  meta: PaginationMeta;
  data: T[];
}

export interface PaginatedParams {
  page?: number;
  per_page?: number;
}

/**
 * Placeholder para o `initialData` do TanStack Query em listas paginadas —
 * evita que a UI precise tratar `undefined` no primeiro render.
 */
export const initialData = {
  data: [],
  meta: {
    current_page: 1,
    last_page: 1,
    next_page: null,
    per_page: 10,
    prev_page: null,
    total: 0,
  },
};
