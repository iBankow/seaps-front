import * as React from "react";
import { Chip } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FilterChipsProps {
  filters: Array<{
    key: string;
    label: string;
    value: string;
  }>;
  onRemoveFilter: (key: string) => void;
  onClearAll: () => void;
  className?: string;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  filters,
  onRemoveFilter,
  onClearAll,
  className,
}) => {
  if (filters.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-sm font-medium text-muted-foreground">
        Filtros ativos:
      </span>
      
      {filters.map((filter) => (
        <Chip
          key={filter.key}
          variant="primary"
          onRemove={() => onRemoveFilter(filter.key)}
          className="animate-in slide-in-from-bottom-1 duration-200"
        >
          <span className="font-medium">{filter.label}:</span>
          <span className="ml-1">{filter.value}</span>
        </Chip>
      ))}
      
      {filters.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <X className="mr-1 h-3 w-3" />
          Limpar tudo
        </Button>
      )}
    </div>
  );
};