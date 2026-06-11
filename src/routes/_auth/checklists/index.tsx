import { createFileRoute } from "@tanstack/react-router";
import { ChecklistList } from "@/features/checklists/ui/checklists-list";

import z from "zod";

const SearchSchema = z.object({
  page: z.number().default(1),
  per_page: z.number().default(10),
  organization_id: z.string().optional(),
  user_id: z.string().optional(),
  status: z.string().optional(),
  property_name: z.string().optional(),
  city: z.string().optional(),
});

export const Route = createFileRoute("/_auth/checklists/")({
  component: RouteComponent,
  validateSearch: SearchSchema,
});

export function RouteComponent() {
  const search = Route.useSearch();

  return <ChecklistList params={search} />;
}
