import { createRouter } from "@tanstack/react-router";

import { routeTree } from "@/routeTree.gen";
import { queryClient } from "@/lib/query-client";

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
    // Injetado em runtime pelo <RouterProvider context={{ auth }} /> em app.tsx,
    // que precisa estar dentro do AuthProvider para chamar useAuth().
    auth: undefined!,
  },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

// Registra a instância para dar type safety a Link, navigate, useSearch etc.
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
