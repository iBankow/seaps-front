import { RadioGroup, RadioGroupItem, Label } from "seaps-front";

export function Default() {
  return (
    <RadioGroup defaultValue="bom" className="w-56">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="bom" id="ds-rg-bom" />
        <Label htmlFor="ds-rg-bom">Bom</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="regular" id="ds-rg-regular" />
        <Label htmlFor="ds-rg-regular">Regular</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="ruim" id="ds-rg-ruim" />
        <Label htmlFor="ds-rg-ruim">Ruim</Label>
      </div>
    </RadioGroup>
  );
}
