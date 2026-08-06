import { redirect } from "@tanstack/react-router";
import type { AuthContextType } from "../context/auth-context";
import { can } from "./permissions";

/**
 * Guarda de permissão para o `beforeLoad` de uma rota.
 *
 * ```ts
 * beforeLoad: ({ context }) => requirePermission(context.auth, "users:edit_configs"),
 * ```
 *
 * Redireciona para a home em vez de estourar erro: quem chegou aqui está
 * autenticado, só não tem acesso a esta área. A API continua sendo quem
 * garante a regra de verdade — isto é só navegação.
 */
export function requirePermission(
  auth: AuthContextType,
  ...guards: string[]
): void {
  if (!can(guards, auth.user?.permissions)) {
    throw redirect({ to: "/" });
  }
}
