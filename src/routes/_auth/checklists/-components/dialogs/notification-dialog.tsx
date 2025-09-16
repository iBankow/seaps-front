import { BadNotification } from "@/components/notifications/bad";
import { GoodNotification } from "@/components/notifications/good";
import { RegularNotification } from "@/components/notifications/regular";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/api";
import { Copy, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const NotificationDialog = ({ row, onOpenChange, open }: any) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);

  const handleCopy = async () => {
    if (contentRef.current) {
      const text = contentRef.current.innerText;
      const html = contentRef.current.innerHTML;

      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/plain": new Blob([text], { type: "text/plain" }),
            "text/html": new Blob([html], { type: "text/html" }),
          }),
        ]);
        toast.info(
          <p className="flex items-center gap-2 flex-nowrap text-nowrap">
            Conteúdo copiado para a área de transferência!
            <Copy className="w-4 h-4" />
          </p>,
          {
            position: "top-center",
            style: { zIndex: 9999, width: "fit-content" },
          }
        );
      } catch (err) {
        console.error("Erro ao copiar:", err);
      }
    }
  };

  const [checklist, setChecklist] = useState<any>({});

  useEffect(() => {
    if (open) {
      api
        .get("/api/v1/checklists/" + row.original.id)
        .then(({ data }) => setChecklist(data))
        .finally(() => setLoading(false));
    }
  }, [open]);

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-fit sm:max-w-fit">
        <DialogHeader>
          <DialogTitle>Notificação</DialogTitle>

          <ScrollArea className="w-full h-[80vh] mt-4 rounded">
            {loading ? (
              <div className="w-[210mm] h-full flex items-center justify-center">
                <Loader2 className="animate-spin" size={64} />
              </div>
            ) : checklist.classification === 0 ? (
              <BadNotification ref={contentRef} checklist={checklist} />
            ) : checklist.classification === 1 ? (
              <RegularNotification ref={contentRef} checklist={checklist} />
            ) : (
              <GoodNotification ref={contentRef} checklist={checklist} />
            )}
          </ScrollArea>
        </DialogHeader>
        <DialogFooter>
          <Button type="submit" disabled={loading} onClick={handleCopy}>
            <Copy /> Copiar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
