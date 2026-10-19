import { http } from "@/lib/http";
import type { User } from "@/types";

export const sessionsApi = {
  /** Hidrata a sessão a partir do cookie httpOnly. 401 aqui é o caso normal
   *  de visitante não autenticado — `lib/http.ts` já não gera toast para ele. */
  me: async () => {
    const { data } = await http.get<User>("/auth/me");

    return data;
  },

  login: async (email: string, password: string) => {
    await http.post("/sessions", { email, password });
  },

  logout: async () => {
    await http.delete("/sessions");
  },

  /** Troca o `code` do MT Login por uma sessão. A troca com o Keycloak é
   *  feita pelo backend; o front só repassa o código. */
  loginWithMTLogin: async (code: string) => {
    await http.post(`/sessions/mt-login?code=${code}`, { code });
  },
};
