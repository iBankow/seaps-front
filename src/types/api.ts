/** Formato padronizado do corpo de erro devolvido pela API. */
export interface ApiErrorBody {
  name?: string;
  message?: string;
  action?: string;
  status?: number;
  errorId?: string;
}
