import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/models/$modelId')({
  component: RouteComponent,
  loader: () => ({
    crumb: "Detalhes do Modelo",
  }),
});

function RouteComponent() {
  return <Outlet />;
}
