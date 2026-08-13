import { Separator } from "seaps-front";

export function Horizontal() {
  return (
    <div className="w-64">
      <p className="text-sm">Item 1</p>
      <Separator className="my-2" />
      <p className="text-sm">Item 2</p>
    </div>
  );
}

export function Vertical() {
  return (
    <div className="flex h-8 items-center gap-3">
      <span className="text-sm">Editar</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Excluir</span>
    </div>
  );
}
