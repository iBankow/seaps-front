import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanstackDevtools } from "@tanstack/react-devtools";

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
      {process.env.NODE_ENV !== "production" ? (
        <TanstackDevtools
          config={{
            position: "bottom-left",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      ) : null}
    </>
  ),
});
