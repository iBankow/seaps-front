export interface Organization {
  id: string;
  acronym: string;
  name: string;
}

/**
 * Usuário autenticado. Une as duas declarações que existiam antes de a auth
 * virar um feature: tudo que não vem em todas as respostas da API é opcional.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  permissions: string[];
  is_active: boolean;
  cpf?: string;
  avatar?: string | null;
  is_deleted?: boolean;
  organization?: Organization;
  created_at?: string;
  updated_at?: string;
}
