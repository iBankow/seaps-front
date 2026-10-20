import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

import { type AuthContextType } from "@/features/auth";
import { NotFoundPage } from "@/features/system";
import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
  auth: AuthContextType;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  notFoundComponent: NotFoundPage,
  component: () => (
    <>
      <Outlet />
    </>
  ),
});
