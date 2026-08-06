import { useNavigate, useSearch } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { useState } from "react";

export function DataFilterForm() {
  const search = useSearch({ from: "/_auth/checklist-notifications/" });
  const navigate = useNavigate({ from: "/checklist-notifications" });

  const [value, setValue] = useState(search.property_name || "");

  const { debouncedCallback } = useDebounce((propertyName: string) => {
    navigate({
      search: {
        ...search,
        property_name: propertyName || undefined,
        page: 1,
      },
      replace: true,
    });
  }, 400);

  return (
    <div className="relative max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        placeholder="Buscar por nome do imóvel..."
        className="pl-9"
        onChange={(e) => {
          setValue(e.target.value);
          debouncedCallback(e.target.value);
        }}
      />
    </div>
  );
}
