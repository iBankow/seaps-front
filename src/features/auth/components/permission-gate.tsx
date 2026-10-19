import type { ReactNode } from "react";
import { useCan } from "../context/auth-context";

type PermissionGateProps = {
  /** Permissões exigidas — todas precisam ser satisfeitas. */
  permissions: string | string[];
  children: ReactNode;
  /** O que renderizar quando o usuário não tem permissão. Padrão: nada. */
  fallback?: ReactNode;
};

/**
 * Renderiza `children` só se o usuário tiver as permissões pedidas.
 *
 * ```tsx
 * <PermissionGate permissions="properties:edit">
 *   <BotaoEditar />
 * </PermissionGate>
 * ```
 *
 * Isso é controle de **visibilidade**, não de acesso — quem garante a regra
 * é a API. Para barrar a navegação, use a guarda de rota (`requirePermission`).
 */
export function PermissionGate({
  permissions,
  children,
  fallback = null,
}: PermissionGateProps) {
  const can = useCan();
  const guards = Array.isArray(permissions) ? permissions : [permissions];

  return <>{can(...guards) ? children : fallback}</>;
}
