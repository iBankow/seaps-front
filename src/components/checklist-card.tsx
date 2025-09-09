/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useModal } from "@/hooks/use-modal";
import { ObservationDialog } from "./observation-dialog";
import { ImageDialog } from "./image-dialog";
import {
  Camera,
  CameraIcon,
  CameraOffIcon,
  MessageSquareText,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ChecklistItem {
  id: string;
  checklist_id: string;
  score?: number;
  image?: string;
  is_valid?: boolean | null;
  item: {
    name: string;
    level: number;
  };
}

interface ChecklistCardProps {
  checklistItem: ChecklistItem;
  status: string;
  propertyId?: string;
}

export const ChecklistCard = ({
  checklistItem,
  status,
}: ChecklistCardProps) => {
  const [item, setChecklistItem] = useState<ChecklistItem>(checklistItem);

  const observationDialog = useModal();
  const imageDialog = useModal();

  const handleChangeValue = async (value: string, id: string) => {
    try {
      const { data } = await api.put(`/api/v1/checklist-items/${id}`, {
        score: value,
      });
      setChecklistItem((prev) => ({ ...prev, ...data }));
    } catch (error) {
      console.error("Error updating checklist item:", error);
    }
  };

  const IS_CLOSE = ["APPROVED", "CLOSED"].includes(status);
  const IS_VALIDED = item.is_valid !== null;

  return (
    <Card className="flex h-[400px] flex-col">
      <CardHeader>
        <CardTitle>{item.item.name}</CardTitle>
      </CardHeader>
      <CardContent
        className={cn(
          "flex h-full flex-col gap-4",
          IS_VALIDED && item.is_valid ? "opacity-50" : ""
        )}
      >
        {item.score === 0 ? (
          <div className="group relative grid h-full w-full place-items-center rounded-lg border-2 bg-muted-foreground/10 px-5 py-2.5 text-center ring-offset-background transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
              <CameraOffIcon
                className="size-16 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
          </div>
        ) : !item.image ? (
          <Link
            params={{
              checklistId: item.checklist_id,
              itemId: item.id,
            }}
            to="/checklists/$checklistId/items/$itemId"
            className="h-full"
            preload={false}
          >
            <div className="group relative grid h-full w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed bg-muted-foreground/10 px-5 py-2.5 text-center ring-offset-background transition hover:bg-muted/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                <CameraIcon
                  className="size-16 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
            </div>
          </Link>
        ) : (
          <Button
            variant="ghost"
            onClick={imageDialog.show}
            className="w-full flex-grow overflow-hidden border bg-muted-foreground/10 object-cover p-0"
          >
            <img
              src={import.meta.env.VITE_BUCKET_URL + item.image}
              alt="checklist-image"
              className="pointer-events-none h-full w-full object-cover"
            />
          </Button>
        )}
        <RadioGroup
          className="grid w-full grid-cols-3"
          disabled={(IS_VALIDED && item.is_valid) || IS_CLOSE}
          onValueChange={(e) => handleChangeValue(e, item.id)}
          defaultValue={String(item.score)}
        >
          <div className="flex w-full flex-col items-center justify-center gap-2 rounded bg-green-300 px-1 py-3 dark:bg-green-800 md:flex-row">
            <RadioGroupItem value="3" id={item.id + `3`} />
            <Label htmlFor={item.id + `3`}>Bom</Label>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-2 rounded bg-yellow-300 px-1 py-3 dark:bg-yellow-800 md:flex-row">
            <RadioGroupItem value="1" id={item.id + `2`} />
            <Label htmlFor={item.id + `2`}>Regular</Label>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-2 rounded bg-red-300 px-1 py-3 dark:bg-red-800 md:flex-row">
            <RadioGroupItem value="-2" id={item.id + `1`} />
            <Label htmlFor={item.id + `1`}>Ruim</Label>
          </div>
          <div className="col-span-3 flex w-full items-center justify-center gap-2 rounded bg-zinc-300 px-1 py-3 dark:bg-zinc-800 md:flex-row">
            <RadioGroupItem value="0" id={item.id + `0`} />
            <Label htmlFor={item.id + `0`}>Não se Aplica</Label>
          </div>
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={observationDialog.show}
        >
          Observação
          <MessageSquareText />
        </Button>
        <Button className="flex-1" variant="outline" asChild>
          <Link
            to="/checklists/$checklistId/items/$itemId"
            params={{
              checklistId: item.checklist_id,
              itemId: item.id,
            }}
            search={{ from: "checklist" }}
            preload={false}
          >
            Imagens
            <Camera />
          </Link>
        </Button>
      </CardFooter>
      <ImageDialog
        item={item}
        onOpenChange={imageDialog.toggle}
        open={imageDialog.visible}
      />
      <ObservationDialog
        status={status}
        item={item}
        onOpenChange={observationDialog.toggle}
        open={observationDialog.visible}
      />
    </Card>
  );
};
