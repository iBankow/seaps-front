export { AuthProvider, useAuth, useCan } from "./context/auth-context";
export type { AuthContextType } from "./context/auth-context";

export { PermissionGate } from "./components/permission-gate";

export { can } from "./lib/permissions";
export { requirePermission } from "./lib/route-guards";
export { config as mtLoginConfig } from "./lib/mt-login";

export { LoginPage } from "./pages/login-page";

export { sessionsApi } from "./api/sessions";
