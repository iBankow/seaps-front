export function can(guards: string[], permissions?: string[]): boolean {
  if (!permissions) {
    return false;
  }

  if (
    permissions.includes("system:admin") ||
    permissions.includes("*") ||
    permissions.includes("*:*")
  ) {
    return true;
  }

  return guards.every((permission) => permissions.includes(permission));
}
