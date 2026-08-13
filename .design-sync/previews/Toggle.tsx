import { Toggle } from "seaps-front";
import { Bold, Italic } from "lucide-react";

export function States() {
  return (
    <div className="flex items-center gap-2">
      <Toggle aria-label="Negrito">
        <Bold />
      </Toggle>
      <Toggle aria-label="Itálico" defaultPressed>
        <Italic />
      </Toggle>
      <Toggle variant="outline" aria-label="Negrito outline">
        <Bold />
      </Toggle>
    </div>
  );
}
