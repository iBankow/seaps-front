import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface QuickFilterOption {
  key: string;
  label: string;
  value: string;
  count?: number;
}

interface QuickFiltersProps {
  title: string;
  options: QuickFilterOption[];
  selectedValues: string[];
  onSelectionChange: (key: string, value: string) => void;
  className?: string;
}

export const QuickFilters: React.FC<QuickFiltersProps> = ({
  title,
  options,
  selectedValues,
  onSelectionChange,
  className,
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <h4 className="text-sm font-medium text-foreground">{title}</h4>
        {selectedValues.length > 0 && (
          <Badge variant="secondary" className="text-xs">
            {selectedValues.length}
          </Badge>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          
          return (
            <Button
              key={option.key}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onSelectionChange(option.key, option.value)}
              className="h-8 text-xs"
            >
              {option.label}
              {option.count !== undefined && (
                <Badge 
                  variant={isSelected ? "secondary" : "default"} 
                  className="ml-2 h-4 px-1 text-xs"
                >
                  {option.count}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>
      
      <Separator className="my-3" />
    </div>
  );
};