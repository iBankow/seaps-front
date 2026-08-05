import axios, { AxiosError } from "axios";
import { apiBaseUrl } from "@/config/env";
import type { ApiErrorBody } from "@/types";

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-Time-Zone": Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
});

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

export default api;
