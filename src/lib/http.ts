import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { apiBaseUrl } from "@/config/env";
import type { ApiErrorBody } from "@/types";

declare module "axios" {
  // A lista de type params precisa ser idêntica à declaração original do
  // axios (`<D = any>`), senão o merge falha com TS2428.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export interface AxiosRequestConfig<D = any> {
    /**
     * Desliga o toast automático de erro desta requisição.
     * Use quando o call site já exibe o erro por conta própria — sem isso,
     * o usuário vê dois toasts para a mesma falha.
     */
    skipErrorToast?: boolean;
  }
}

export const http = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    // Sem Content-Type default de propósito: o axios infere (application/json
    // para objetos, multipart com boundary para FormData). Fixar
    // "application/json" aqui atrapalha upload e downloads blob.
    "X-Time-Zone": Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
});

/** Endpoints em que 401 é esperado (visitante não autenticado) e não vira toast. */
const SILENT_401_ENDPOINTS = ["/auth/me"];

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    const url = error.config?.url ?? "";

    if (error.config?.skipErrorToast) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      SILENT_401_ENDPOINTS.some((path) => url.endsWith(path))
    ) {
      return Promise.reject(error);
    }

    // Tudo opcional-encadeado: em erro de rede/timeout/CORS não existe
    // `response`, e um TypeError aqui dentro substituiria o AxiosError,
    // quebrando os checks de `error.response?.status` lá na frente.
    const body = error.response?.data;

    if (body?.message) {
      toast.error(body.message, { description: body.action });
    } else {
      toast.error("Erro ao tentar processar a requisição. Tente novamente.");
    }

    return Promise.reject(error);
  },
);

export function isApiError(error: unknown) {
  if (error instanceof AxiosError) {
    const body = error.response?.data as ApiErrorBody | undefined;

    return !!body?.message && !!body?.action;
  }

  return false;
}

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage = "Nao foi possivel completar a operacao.",
) {
  if (error instanceof AxiosError) {
    const body = error.response?.data as ApiErrorBody | undefined;
    return body?.message ?? fallbackMessage;
  }

  return fallbackMessage;
}

export function getApiErrorAction(
  error: unknown,
  fallbackMessage = "Tente novamente mais tarde.",
) {
  if (error instanceof AxiosError) {
    const body = error.response?.data as ApiErrorBody | undefined;
    return body?.action ?? fallbackMessage;
  }

  return fallbackMessage;
}

export default http;
