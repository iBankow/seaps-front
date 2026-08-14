import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { useState } from "react";
import { bucketUrl } from "@/config/env";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/use-modal";
import { useChecklist } from "@/contexts/checklist-context";
import { toast } from "sonner";
import { Loading } from "@/components/common/loading";
import { SectionLabel } from "@/components/common/section-label";
import { StatusBadge } from "@/features/checklists";
import {
  DeleteChecklistItemImageDialog,
  ImageDialog,
  ObservationDialog,
  useChecklistItem,
  useUploadChecklistItemImages,
} from "@/features/checklist-items";

const MAX_IMAGES = 10;

export const Route = createFileRoute(
  "/_auth/checklists/$checklistId/items/$itemId/"
)({
  component: ChecklistItemPage,
});

function ChecklistItemPage() {
  const { checklistId, itemId } = useParams({
    from: "/_auth/checklists/$checklistId/items/$itemId",
  });

  const { checklist } = useChecklist();
  const [uploading, setUploading] = useState(false);

  const { data: item, isLoading } = useChecklistItem(itemId);
  const { mutateAsync: uploadImages } = useUploadChecklistItemImages(itemId);

  const observationDialog = useModal();
  const imageDialog = useModal();

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !item) return;

    setUploading(true);
    try {
      const existingImages = item.images?.length ?? 0;
      const availableSlots = MAX_IMAGES - existingImages;

      if (availableSlots <= 0) {
        toast.error(`Limite máximo de ${MAX_IMAGES} imagens atingido.`);
        return;
      }

      const filesToUpload = Array.from(files).slice(0, availableSlots);

      const formData = new FormData();
      filesToUpload.forEach((img) => {
        formData.append("file", img);
      });

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
    return <Loading />;
  }

  const IS_CLOSE = ["APPROVED", "CLOSED"].includes(checklist?.status || "");
  const imageCount = item.images?.length ?? 0;

  return (
    <Card className="gap-5 p-[22px]">
      <div className="flex items-start gap-3">
        <Button variant="outline" size="icon" asChild>
          <Link to=".." search={{ id: checklistId }}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar para os itens</span>
          </Link>
        </Button>
        <div className="min-w-0">
          <h2 className="font-heading text-[19px] leading-tight font-bold tracking-[0.03em] uppercase">
            {item.item?.name}
          </h2>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {checklist?.property?.name}
          </p>
        </div>
        <div className="ml-auto shrink-0">
          <StatusBadge status={checklist?.status || "OPEN"} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <SectionLabel
          hint={`${imageCount}/${MAX_IMAGES}`}
          action={
            <>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={IS_CLOSE || uploading}
                className="hidden"
                id="image-upload"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("image-upload")?.click()}
                disabled={IS_CLOSE || uploading}
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
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {item.images?.map((image, index) => (
              <div
                key={image.id}
                className="overflow-hidden rounded-lg border border-border bg-card"
              >
                <button
                  type="button"
                  onClick={() => imageDialog.showIndex(index)}
                  className="block aspect-video w-full cursor-pointer overflow-hidden outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
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
      </div>

      <ImageDialog
        item={item}
        onOpenChange={imageDialog.toggle}
        open={imageDialog.visible}
        index={imageDialog.index}
      />
      <ObservationDialog
        status={checklist?.status || "OPEN"}
        item={item}
        onOpenChange={observationDialog.toggle}
        open={observationDialog.visible}
      />
    </Card>
  );
}
