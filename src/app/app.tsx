import { RouterProvider } from "@tanstack/react-router";

import { AppProviders } from "./providers";
import { router } from "./router";
import { useAuth } from "@/features/auth";

/**
 * Ponte entre o AuthProvider (context do React) e o context do router.
 * Precisa ser um componente à parte porque useAuth() só pode ser chamado
 * dentro do <AuthProvider>, que mora em <AppProviders>.
 */
function RouterWithAuth() {
  const auth = useAuth();

  return <RouterProvider router={router} context={{ auth }} />;
}

export function App() {
  return (
    <AppProviders>
      <RouterWithAuth />
    </AppProviders>
  );
}
