import { Switch, Label } from "seaps-front";

export function States() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Switch id="ds-sw-off" />
        <Label htmlFor="ds-sw-off">Desligado</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="ds-sw-on" defaultChecked />
        <Label htmlFor="ds-sw-on">Ligado</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="ds-sw-sm" size="sm" defaultChecked />
        <Label htmlFor="ds-sw-sm">Pequeno</Label>
      </div>
    </div>
  );
}
