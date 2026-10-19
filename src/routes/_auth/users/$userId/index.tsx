import { createFileRoute } from "@tanstack/react-router";
import { UserDetail } from "@/features/users";

export const Route = createFileRoute("/_auth/users/$userId/")({
  component: UserDetail,
  loader: () => ({
    crumb: "Usuário",
  }),
});
