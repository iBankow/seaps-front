import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, Button } from "seaps-front";

export function Default() {
  return (
    <TooltipProvider>
      <Tooltip open>
        <TooltipTrigger asChild>
          <Button variant="outline">Passe o mouse</Button>
        </TooltipTrigger>
        <TooltipContent>Finalizar checklist</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
