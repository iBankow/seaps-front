import { Card, CardContent } from "@/components/ui/card";
import { useChecklist } from "@/contexts/checklist-context";
import { BackButton } from "@/components/layout/back-button";
import { StatusBadge } from "./status-badge";
import { getStatusToneClass } from "./status-colors";
import { cn } from "@/lib/utils";

export const ChecklistHeader = () => {
  const { checklist } = useChecklist();

  return (
    <Card className="mb-6 overflow-hidden pt-0">
      <div className={cn("h-1", getStatusToneClass(checklist.status))} />
      <CardContent>
        <div className="flex items-center gap-2 w-full">
          <BackButton variant={"outline"} />
          <h1 className="text-3xl font-bold uppercase">{checklist.sid}</h1>
          <div className="ml-auto">
            <StatusBadge status={checklist.status} />
          </div>
        </div>
        <p className="text-muted-foreground text">{checklist.property.name}</p>
      </CardContent>
    </Card>
  );
};
