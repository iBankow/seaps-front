import { useEffect, useState } from "react";
import { useModelItemsCatalog } from "../api/models";
import type { ModelItem } from "../types";

/**
 * Catálogo de itens para os selects de item de modelo — inclui itens criados
 * na sessão atual antes de existirem no catálogo remoto.
 */
export function useItemsCatalog() {
  const { data } = useModelItemsCatalog();
  const [localItems, setLocalItems] = useState<ModelItem[]>([]);

  useEffect(() => {
    if (data) {
      setLocalItems(data);
    }
  }, [data]);

  const handleCreate = (
    inputValue: string,
    onChange: (value: string) => void,
  ) => {
    setLocalItems((prev) => [
      ...prev,
      { id: Date.now().toString(), name: inputValue.toUpperCase() },
    ]);

    return onChange(inputValue.toUpperCase());
  };

  return { items: localItems, handleCreate };
}
