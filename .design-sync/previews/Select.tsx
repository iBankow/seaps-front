import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "seaps-front";

export function Default() {
  return (
    <Select defaultValue="detran" open modal={false}>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Selecione o órgão" />
      </SelectTrigger>
      <SelectContent position="popper">
        <SelectGroup>
          <SelectLabel>Órgãos</SelectLabel>
          <SelectItem value="detran">DETRAN</SelectItem>
          <SelectItem value="seplag">SEPLAG</SelectItem>
          <SelectItem value="sead">SEAD</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
