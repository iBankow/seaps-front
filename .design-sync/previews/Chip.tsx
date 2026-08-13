import { Chip } from "seaps-front";

export function Variants() {
  return (
    <div className="flex flex-wrap gap-2">
      <Chip variant="default">Padrão</Chip>
      <Chip variant="primary">Primário</Chip>
      <Chip variant="secondary">Secundário</Chip>
      <Chip variant="destructive">Removido</Chip>
      <Chip variant="success">Concluído</Chip>
      <Chip variant="warning">Pendente</Chip>
      <Chip variant="info">Info</Chip>
    </div>
  );
}

export function Removable() {
  return (
    <div className="flex gap-2">
      <Chip variant="primary" onRemove={() => {}}>
        DETRAN
      </Chip>
      <Chip variant="secondary" onRemove={() => {}}>
        Aberto
      </Chip>
    </div>
  );
}
