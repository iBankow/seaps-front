import { useMemo } from "react";
import { ChecklistCard } from "@/components/checklist-card";

interface VirtualizedChecklistGridProps {
  items: any[];
  status: string;
}

export function VirtualizedChecklistGrid({ items, status }: VirtualizedChecklistGridProps) {
  // Memoriza a renderização dos cards para evitar re-cálculos
  const renderedCards = useMemo(() => {
    return items.map((item) => (
      <ChecklistCard
        key={item.id}
        checklistItem={item}
        status={status}
      />
    ));
  }, [items, status]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {renderedCards}
    </div>
  );
}
