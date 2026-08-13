import { Label, Input } from "seaps-front";

export function Default() {
  return (
    <div className="flex w-64 flex-col gap-1.5">
      <Label htmlFor="ds-org">Órgão</Label>
      <Input id="ds-org" placeholder="DETRAN" />
    </div>
  );
}
