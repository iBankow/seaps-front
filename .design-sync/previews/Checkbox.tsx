import { Checkbox, Label } from "seaps-front";

export function States() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox id="ds-cb-unchecked" />
        <Label htmlFor="ds-cb-unchecked">Não marcado</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="ds-cb-checked" defaultChecked />
        <Label htmlFor="ds-cb-checked">Marcado</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="ds-cb-disabled" disabled />
        <Label htmlFor="ds-cb-disabled">Desabilitado</Label>
      </div>
    </div>
  );
}
