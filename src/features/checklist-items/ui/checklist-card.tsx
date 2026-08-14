/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { bucketUrl } from "@/config/env";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScoreRadioGroup } from "./score-radio-group";
import { useDialogContext } from "@/contexts/dialog-context";
import {
  Camera,
  CameraIcon,
  CameraOffIcon,
  MessageSquareText,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { http as api } from "@/lib/http";
import { cn } from "@/lib/utils";
import { useState, useCallback, memo } from "react";
import { useDebounce } from "@/hooks/use-debounce";

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

const ChecklistCardComponent = ({
  checklistItem,
  status,
}: ChecklistCardProps) => {
  const [item, setChecklistItem] = useState<ChecklistItem>(checklistItem);
  const { observationDialog, imageDialog } = useDialogContext();

  // API call sem debounce, mas otimizada
  const updateScore = useCallback(async (value: string, id: string) => {
    try {
      const { data } = await api.put(`/checklist-items/${id}`, {
        score: value,
      });
      setChecklistItem((prev) => ({ ...prev, ...data }));
    } catch (error) {
      console.error("Error updating checklist item:", error);
    }
  }, []);

  // Usa debounce para evitar múltiplas chamadas consecutivas
  const { debouncedCallback: debouncedUpdateScore } = useDebounce(
    updateScore,
    300,
  );

  // O controle de pontuação é controlado: pinta a escolha na hora e deixa a
  // resposta da API reconciliar depois, senão a seleção só apareceria após o
  // debounce + round-trip.
  const handleChangeValue = useCallback(
    (value: string, id: string) => {
      setChecklistItem((prev) => ({ ...prev, score: Number(value) }));
      debouncedUpdateScore(value, id);
    },
    [debouncedUpdateScore],
  );

  const handleObservationClick = useCallback(() => {
    observationDialog.open(item, status);
  }, [item, status, observationDialog]);

  const handleImageClick = useCallback(() => {
    imageDialog.open(item);
  }, [item, imageDialog]);

  const IS_CLOSE = ["APPROVED", "CLOSED"].includes(status);
  const IS_VALIDED = item.is_valid !== null;

  return (
    <Card className="flex h-[400px] flex-col">
      <CardHeader>
        <CardTitle className="font-heading text-[13px] font-semibold tracking-wide uppercase">
          {item.item.name}
        </CardTitle>
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
            onClick={handleImageClick}
            className="w-full flex-grow overflow-hidden border bg-muted-foreground/10 object-cover p-0"
          >
            <img
              src={bucketUrl(item.image)}
              alt="checklist-image"
              className="pointer-events-none h-full w-full object-cover"
              loading="lazy"
            />
          </Button>
        )}
        <ScoreRadioGroup
          value={item.score}
          disabled={(IS_VALIDED && item.is_valid) || IS_CLOSE}
          onValueChange={(e) => handleChangeValue(e, item.id)}
        />
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleObservationClick}
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
    </Card>
  );
};

// Memo para evitar re-renderizações desnecessárias
export const ChecklistCard = memo(ChecklistCardComponent, (prevProps, nextProps) => {
  // Re-renderiza apenas se o item ou status mudou
  return (
    prevProps.checklistItem.id === nextProps.checklistItem.id &&
    prevProps.status === nextProps.status &&
    prevProps.checklistItem.score === nextProps.checklistItem.score &&
    prevProps.checklistItem.image === nextProps.checklistItem.image &&
    prevProps.checklistItem.is_valid === nextProps.checklistItem.is_valid
  );
});
