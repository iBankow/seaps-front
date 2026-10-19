import { createFileRoute } from "@tanstack/react-router";
import { UserEditForm } from "@/features/users";

export const Route = createFileRoute("/_auth/users/$userId/edit/")({
  component: UserEditForm,
  loader: () => ({
    crumb: "Editar",
  }),
});
