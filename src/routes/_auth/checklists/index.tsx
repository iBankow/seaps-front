import { createFileRoute } from "@tanstack/react-router";

import { useIsMobile } from "@/hooks/use-mobile";
import { ChecklistList } from "@/features/checklists/ui/checklists-list";
import { ChecklistListMobile } from "@/features/checklists/ui/mobile/checklist-list";
import z from "zod";
import { useEffect, useState } from "react";

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
  const isMobile = useIsMobile();
  const search = Route.useSearch();

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, [isMobile]);

  if (!loaded) {
    return null;
  }

  if (isMobile) {
    return <ChecklistListMobile search={search} />;
  }

  return <ChecklistList params={search} />;
}
