import { PropertiesList } from "#/features/properties/ui/properties-list";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

const SearchSchema = z.object({
  page: z.number().default(1),
  per_page: z.number().default(10),
  organization_id: z.string().optional(),
  type: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  name: z.string().optional(),
});

export const Route = createFileRoute("/_auth/properties/")({
  component: RouteComponent,
  validateSearch: SearchSchema,
});

function RouteComponent() {
  const params = Route.useSearch();

  return <PropertiesList params={params} />;
}
