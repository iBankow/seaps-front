import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useBlocker } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RSCreatable } from "@/components/common/react-select";
import { SectionLabel } from "@/components/common/section-label";
import { Loading } from "@/components/common/loading";
import { Plus } from "lucide-react";
import { useModel, useUpdateModel } from "../api/models";
import { useItemsCatalog } from "../lib/use-items-catalog";
import type { ModelItem } from "../types";

export interface ModelDetailPanelProps {
  modelId: string;
  /** Notifica o pai a cada mudança no estado "há alterações não salvas". */
  onDirtyChange?: (dirty: boolean) => void;
}

const UNSAVED_CHANGES_MESSAGE =
  "Este modelo tem alterações não salvas. Se sair agora, elas serão perdidas. Deseja sair mesmo assim?";

/** Painel de detalhe/edição da tela de Modelos — itens adicionados e removidos
 * localmente, persistidos de uma vez em "Salvar modelo". */
export function ModelDetailPanel({
  modelId,
  onDirtyChange,
}: ModelDetailPanelProps) {
  const { data: model, isLoading } = useModel(modelId);
  const { mutateAsync: updateModel, isPending } = useUpdateModel(modelId);
  const { items: catalogItems, handleCreate } = useItemsCatalog();

  const [items, setItems] = useState<{ name: string }[]>([]);
  const [newItemName, setNewItemName] = useState<string | null>(null);
  const [itemsModelId, setItemsModelId] = useState<string | null>(null);

  // Ao trocar de modelo (mudança de id), reseta o rascunho de itens ainda
  // durante o render — feito num efeito, ficaria um frame comparando os
  // itens do modelo antigo com os dados do modelo novo e piscando o aviso
  // de "alterações não salvas" à toa.
  if (model && model.id !== itemsModelId) {
    setItemsModelId(model.id);
    setItems(model.items.map((item) => ({ name: item.name })));
    setNewItemName(null);
  }

  const originalNames = model?.items.map((item) => item.name) ?? [];
  const currentNames = items.map((item) => item.name);
  const isDirty =
    currentNames.length !== originalNames.length ||
    currentNames.some((name, index) => name !== originalNames[index]);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  // Bloqueia navegação de rota (e avisa em fechar/atualizar a aba) enquanto
  // houver mudanças não salvas neste modelo.
  useBlocker(() => !window.confirm(UNSAVED_CHANGES_MESSAGE), isDirty);

  if (isLoading || !model) {
    return (
      <Card className="flex h-64 items-center justify-center">
        <Loading size="sm" />
      </Card>
    );
  }

  const addItem = () => {
    if (!newItemName) return;
    const name = newItemName.toUpperCase();
    if (items.some((item) => item.name === name)) {
      setNewItemName(null);
      return;
    }
    setItems((prev) => [...prev, { name }]);
    setNewItemName(null);
  };

  const removeItem = (name: string) => {
    setItems((prev) => prev.filter((item) => item.name !== name));
  };

  const handleRevert = () => {
    setItems(model.items.map((item) => ({ name: item.name })));
    setNewItemName(null);
  };

  const handleSave = async () => {
    try {
      await updateModel({
        name: model.name,
        description: model.description,
        items,
      });
      toast.success("Modelo salvo com sucesso!");
    } catch {
      toast.error("Erro ao salvar o modelo");
    }
  };

  return (
    <Card className="gap-5 p-[22px]">
      <div className="flex items-start gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="font-heading text-xl font-bold tracking-wide uppercase">
              {model.name}
            </h2>
            {isDirty && <Badge variant="warning">Alterações não salvas</Badge>}
          </div>
          {model.description && (
            <p className="mt-1.5 text-[11.5px] text-muted-foreground">
              {model.description}
            </p>
          )}
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleRevert}
            disabled={isPending || !isDirty}
            className="font-heading text-xs uppercase leading-0"
          >
            Reverter alterações
          </Button>
          <Button
            onClick={handleSave}
            disabled={isPending || !isDirty}
            className="font-heading text-xs uppercase leading-0"
          >
            {isPending ? "Salvando..." : "Salvar modelo"}
          </Button>
        </div>
      </div>

      <SectionLabel hint={`${items.length} itens`}>
        Itens avaliados
      </SectionLabel>

      {items.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-2.5">
          {items.map((item, index) => (
            <div
              key={item.name}
              className="flex min-w-0 items-center gap-3 rounded-lg border border-border bg-secondary px-3.5 py-3"
            >
              <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1 truncate font-heading text-[12.5px] font-semibold tracking-wide uppercase">
                {item.name}
              </span>
              <button
                type="button"
                onClick={() => removeItem(item.name)}
                aria-label={`Remover ${item.name}`}
                className="shrink-0 text-lg leading-none text-muted-foreground transition-colors hover:text-destructive"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Este modelo ainda não possui itens.
        </p>
      )}

      <div className="flex gap-2.5">
        <RSCreatable
          className="flex-1"
          placeholder="Selecione ou crie um item (ex.: Subestação)"
          options={catalogItems}
          value={catalogItems.find((item) => item.name === newItemName) || null}
          onChange={(val: ModelItem | null) =>
            setNewItemName(val ? val.name : null)
          }
          onCreateOption={(newValue: string) =>
            handleCreate(newValue, setNewItemName)
          }
        />
        <Button
          type="button"
          variant="outline"
          onClick={addItem}
          disabled={!newItemName}
          className="shrink-0 font-heading text-xs uppercase leading-0 h-9"
        >
          <Plus size={14} />
          Adicionar item
        </Button>
      </div>
    </Card>
  );
}
