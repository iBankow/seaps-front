import { Button } from "seaps-front";
import { Plus, Trash2 } from "lucide-react";

export function Variants() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="default">Salvar</Button>
      <Button variant="outline">Cancelar</Button>
      <Button variant="secondary">Secundário</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Excluir</Button>
      <Button variant="link">Ver detalhes</Button>
    </div>
  );
}

export function Sizes() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xs">Extra pequeno</Button>
      <Button size="sm">Pequeno</Button>
      <Button size="default">Padrão</Button>
      <Button size="lg">Grande</Button>
      <Button size="icon" aria-label="Adicionar">
        <Plus />
      </Button>
    </div>
  );
}

export function WithIconAndDisabled() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="default">
        <Plus /> Novo checklist
      </Button>
      <Button variant="destructive">
        <Trash2 /> Remover
      </Button>
      <Button disabled>Desabilitado</Button>
    </div>
  );
}
