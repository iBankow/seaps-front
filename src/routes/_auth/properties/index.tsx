import { createFileRoute } from "@tanstack/react-router";

import z from "zod";
import { PropertiesList } from "@/features/properties/ui/properties-list";

const SearchSchema = z.object({
  page: z.number().default(1),
  per_page: z.number().default(10),
  organization_id: z.string().optional(),
  type: z.enum(["OWN", "RENTED", "GRANT"]).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  name: z.string().optional(),
});

export const Route = createFileRoute("/_auth/properties/")({
  component: RouteComponent,
  validateSearch: SearchSchema,
});

export function RouteComponent() {
  const search = Route.useSearch();

  return <PropertiesList params={search} />;
}
