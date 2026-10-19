/** Permissões que dão acesso a tudo. */
const WILDCARDS = ["system:admin", "*", "*:*"];

/**
 * Verifica se `permissions` satisfaz **todos** os guards pedidos.
 *
 * Não há expansão de curinga por recurso: `properties:*` não cobre
 * `properties:edit`. Só os curingas globais acima liberam geral.
 */
export function can(guards: string[], permissions?: string[]): boolean {
  if (!permissions) {
    return false;
  }

  if (WILDCARDS.some((wildcard) => permissions.includes(wildcard))) {
    return true;
  }

  return guards.every((permission) => permissions.includes(permission));
}
