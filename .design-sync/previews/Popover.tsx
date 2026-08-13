import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
  Button,
} from "seaps-front";

export function Default() {
  return (
    <Popover open modal={false}>
      <PopoverTrigger asChild>
        <Button variant="outline">Filtros</Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Filtrar checklists</PopoverTitle>
          <PopoverDescription>Escolha o status e o período.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  );
}
