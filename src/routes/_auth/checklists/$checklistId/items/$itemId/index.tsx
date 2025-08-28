import {
  createFileRoute,
  useParams,
  Link,
  useRouter,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera, Upload, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/use-modal";
import { ObservationDialog } from "@/components/observation-dialog";
import { ImageDialog } from "@/components/image-dialog";
import { useChecklist } from "@/contexts/checklist-context";
import { toast } from "sonner";
import type { ChecklistItem } from "types/types";
import { Loading } from "@/components/loading";

export const Route = createFileRoute(
  "/_auth/checklists/$checklistId/items/$itemId/"
)({
  component: ChecklistItem,
});

function ChecklistItem() {
  const router = useRouter();

  const { checklistId, itemId } = useParams({
    from: "/_auth/checklists/$checklistId/items/$itemId",
  });

  const { checklist } = useChecklist();
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [item, setItem] = useState<ChecklistItem | null>(null);

  const observationDialog = useModal();
  const imageDialog = useModal();

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const { data } = await api.get(
        `/api/v1/checklists/${checklistId}/items/${itemId}`
      );
      const existingImages = Array.isArray(data.images)
        ? data.images.length
        : 0;

      const maxImages = 10;
      const availableSlots = maxImages - existingImages;

      if (availableSlots <= 0) {
        toast.error("Limite máximo de 10 imagens atingido.");
        setUploading(false);
        return;
      }

      const filesToUpload = Array.from(files).slice(0, availableSlots);

      const formData = new FormData();
      filesToUpload.forEach((img) => {
        formData.append("file", img);
      });

      await api.post(
        `/api/v1/checklists/${checklistId}/items/${itemId}/images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (filesToUpload.length < files.length) {
        toast.warning(
          `Apenas ${availableSlots} imagens foram enviadas. Limite máximo de 10 imagens por item.`
        );
      } else {
        toast.success("Imagens enviadas com sucesso!");
      }

      router.navigate({ to: "." });
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Erro ao enviar imagens");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    try {
      await api.delete(
        `/api/v1/checklists/${checklistId}/items/${itemId}/images`
      );

      // Refresh items after deletion
      window.location.reload();
      toast.success("Imagem removida com sucesso!");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Erro ao remover imagem");
    }
  };

  useEffect(() => {
    api
      .get(`/api/v1/checklists/${checklistId}/items/${itemId}`)
      .then(({ data }) => setItem(data))
      .finally(() => setIsLoading(false));
  }, [itemId, checklistId]);

  if (isLoading || !item) {
    return <Loading />;
  }

  const IS_CLOSE = ["APPROVED", "CLOSED"].includes(checklist?.status || "");
  // const IS_VALIDED = item?.is_valid !== null;

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to=".." search={{ id: checklistId }}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {item.item?.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            Checklist: {checklist?.property?.name} - Status: {checklist?.status}
          </p>
        </div>
      </div>

      <div className="flex gap-2 self-end">
        <Input
          type="file"
          accept="images/*"
          multiple
          onChange={handleImageUpload}
          disabled={IS_CLOSE || uploading}
          className="hidden"
          id="image-upload"
        />
        <Button
          variant="outline"
          onClick={() => document.getElementById("image-upload")?.click()}
          disabled={IS_CLOSE || uploading}
        >
          <Upload className="mr-2 h-4 w-4" />
          {uploading ? "Enviando..." : "Enviar Imagem"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {item.images?.map((image, index) => (
          <Card key={image.id}>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="relative aspect-video overflow-hidden rounded-lg border">
                  <Button
                    variant={"ghost"}
                    className="p-0"
                    asChild
                    onClick={() => imageDialog.showIndex(index)}
                  >
                    <img
                      src={import.meta.env.VITE_BUCKET_URL + image.image}
                      alt={`Imagem do item ${item.item?.name}`}
                      className="h-full w-full object-cover"
                    />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={imageDialog.show}
                    disabled={IS_CLOSE}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Visualizar
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleDeleteImage}
                    disabled={IS_CLOSE}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remover
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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
    </div>
  );
}
