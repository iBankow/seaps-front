/**
 * Shim temporário — o cliente real é `lib/http.ts`.
 * Removido no commit seguinte, quando os imports forem repontados.
 */
export {
  getApiErrorAction,
  getApiErrorMessage,
  isApiError,
  http as default,
} from "./http";
