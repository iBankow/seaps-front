import {
  createFileRoute,
  useLoaderData,
  useParams,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { bucketUrl } from "@/config/env";
import { Button } from "@/components/ui/button";
import { Camera, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useModal } from "@/hooks/use-modal";
import { useChecklist } from "@/contexts/checklist-context";
import { toast } from "sonner";
import { Loading } from "@/components/common/loading";
import { SectionLabel } from "@/components/common/section-label";
import {
  DeleteChecklistItemImageDialog,
  ImageDialog,
  ScoreRadioGroup,
  useChecklistItem,
  useUpdateChecklistItem,
  useUploadChecklistItemImages,
} from "@/features/checklist-items";

const MAX_IMAGES = 10;

export const Route = createFileRoute(
  "/_auth/checklists/$checklistId/items/$itemId/"
)({
  component: ChecklistItemPage,
});

function ChecklistItemPage() {
  const { itemId } = useParams({
    from: "/_auth/checklists/$checklistId/items/$itemId",
  });

  const { checklist } = useChecklist();
  const [uploading, setUploading] = useState(false);

  // O loader da rota já buscou o item; semear a query com ele evita um segundo
  // request a cada clique na lista.
  const { checklistItem } = useLoaderData({
    from: "/_auth/checklists/$checklistId/items/$itemId",
  });

  const { data: item, isLoading } = useChecklistItem(itemId, checklistItem);
  const { mutateAsync: uploadImages } = useUploadChecklistItemImages(itemId);
  const { mutate: updateItem } = useUpdateChecklistItem(itemId);

  const imageDialog = useModal();

  // A observação é um rascunho local: só sobe no blur, senão cada tecla viraria
  // um PUT. Ressincroniza quando a rota troca de item.
  const [observation, setObservation] = useState("");
  useEffect(() => {
    setObservation(item?.observation ?? "");
  }, [item?.id, item?.observation]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !item) return;

    setUploading(true);
    try {
      const availableSlots = MAX_IMAGES - (item.images?.length ?? 0);

      if (availableSlots <= 0) {
        toast.error(`Limite máximo de ${MAX_IMAGES} imagens atingido.`);
        return;
      }

      const filesToUpload = Array.from(files).slice(0, availableSlots);

      const formData = new FormData();
      filesToUpload.forEach((img) => formData.append("file", img));

      await uploadImages(formData);

      if (filesToUpload.length < files.length) {
        toast.warning(
          `Apenas ${availableSlots} imagens foram enviadas. Limite máximo de ${MAX_IMAGES} imagens por item.`
        );
      } else {
        toast.success("Imagens enviadas com sucesso!");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Erro ao enviar imagens");
    } finally {
      setUploading(false);
    }
  };

  if (isLoading || !item) {
    return (
      <Card className="p-[22px]">
        <Loading />
      </Card>
    );
  }

  const isClosed = ["APPROVED", "CLOSED"].includes(checklist?.status || "");
  const imageCount = item.images?.length ?? 0;

  return (
    <Card className="gap-0 p-[22px] min-h-[610px]">
      <h2 className="font-heading text-[19px] leading-tight font-bold tracking-[0.03em] uppercase">
        {item.item?.name}
      </h2>
      <p className="mt-1 text-[11px] text-muted-foreground">
        {checklist?.property?.name}
      </p>

      <SectionLabel className="mt-[22px] mb-2.5">Pontuação</SectionLabel>
      <ScoreRadioGroup
        value={item.score}
        disabled={isClosed}
        onValueChange={(value) => updateItem({ score: Number(value) })}
      />

      <SectionLabel
        className="mt-[26px] mb-2.5"
        hint={`${imageCount}/${MAX_IMAGES}`}
        action={
          <>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={isClosed || uploading}
              className="hidden"
              id="image-upload"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("image-upload")?.click()}
              disabled={isClosed || uploading}
            >
              <Upload />
              {uploading ? "Enviando..." : "Enviar imagem"}
            </Button>
          </>
        }
      >
        Imagens
      </SectionLabel>

      {imageCount === 0 ? (
        <div className="grid place-items-center gap-2 rounded-lg border border-dashed border-input bg-secondary py-12 text-center">
          <Camera className="size-8 text-muted-foreground" aria-hidden />
          <p className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
            Nenhuma imagem enviada
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2.5">
          {item.images?.map((image, index) => (
            <div
              key={image.id}
              className="overflow-hidden rounded-lg border border-border bg-card"
            >
              <button
                type="button"
                onClick={() => imageDialog.showIndex(index)}
                className="block h-24 w-full cursor-pointer overflow-hidden outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <img
                  src={bucketUrl(image.image)}
                  alt={`Imagem do item ${item.item?.name}`}
                  className="h-full w-full object-cover transition-transform hover:scale-[1.03]"
                  loading="lazy"
                />
              </button>
              <div className="flex items-center gap-2 border-t border-border p-2">
                <span className="font-mono text-[9px] tracking-[0.06em] text-muted-foreground uppercase">
                  Foto {String(index + 1).padStart(2, "0")}
                </span>
                <div className="ml-auto">
                  <DeleteChecklistItemImageDialog image={image} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <SectionLabel className="mt-[26px] mb-2.5">Observações</SectionLabel>
      <Textarea
        value={observation}
        onChange={(event) => setObservation(event.target.value)}
        onBlur={() => {
          if (observation !== (item.observation ?? "")) {
            updateItem({ observation });
          }
        }}
        disabled={isClosed}
        placeholder="Observações gerais sobre o item…"
        className="min-h-[88px] resize-y bg-secondary text-[13px] leading-relaxed"
      />

      <ImageDialog
        item={item}
        onOpenChange={imageDialog.toggle}
        open={imageDialog.visible}
        index={imageDialog.index}
      />
    </Card>
  );
}
