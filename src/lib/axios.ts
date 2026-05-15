import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-Time-Zone": Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
});

export interface User {
  id: string;
  cpf: string;
  name: string;
  email: string;
  avatar?: string | null;
  permissions: string[];
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  organization?: {
    id: string;
    acronym: string;
    name: string;
  };
}

// Funções da API de autenticação
export const authAPI = {
  login: async (email: string, password: string): Promise<void> => {
    const response = await api.post("/sessions", { email, password });
    return response.data;
  },

  getMe: async (): Promise<User | null> => {
    try {
      const response = await api.get("/sessions/me");
      return response.data;
    } catch (error) {
      return null;
    }
  },
};

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
  page: number;
  per_page?: number;
}

export default api;
