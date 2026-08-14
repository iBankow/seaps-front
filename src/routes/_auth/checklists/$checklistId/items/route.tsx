import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  ChecklistItemsList,
  useChecklistsItems,
} from "@/features/checklist-items";

export const Route = createFileRoute("/_auth/checklists/$checklistId/items")({
  component: RouteComponent,
  loader: () => ({ crumb: "Itens" }),
});

/**
 * Master-detail do design: lista de itens à esquerda, item selecionado à
 * direita. O painel direito é a rota filha — `items/` mostra o vazio e
 * `items/$itemId` mostra o editor —, então o deep link para um item continua
 * valendo.
 */
function RouteComponent() {
  const { checklistId } = Route.useParams();
  const { data: items } = useChecklistsItems(checklistId);

  const done = items.filter((item) => item.score !== null).length;

  return (
    <div className="grid grid-cols-1 items-start gap-3.5 lg:grid-cols-[344px_minmax(0,1fr)]">
      <ChecklistItemsList
        items={items}
        progressLabel={`${done}/${items.length} itens`}
      />
      <Outlet />
    </div>
  );
}
