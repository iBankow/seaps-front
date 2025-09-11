import { RegularNotification } from "@/components/notifications/regular";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  // DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy } from "lucide-react";
import { useRef } from "react";

export const NotificationDialog = ({ onOpenChange, open }: any) => {
  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleCopy = async () => {
    if (contentRef.current) {
      // pega só o texto formatado (sem tags) — use .innerHTML se quiser com HTML
      const text = contentRef.current.innerHTML;

      try {
        await navigator.clipboard.writeText(text);
        alert("Conteúdo copiado para a área de transferência!");
      } catch (err) {
        console.error("Erro ao copiar:", err);
      }
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-fit sm:max-w-fit">
        <DialogHeader>
          <DialogTitle>Deseja reabrir o checklist?</DialogTitle>
          <ScrollArea className="w-full h-[80vh] mt-4">
            <RegularNotification ref={contentRef} />
          </ScrollArea>
        </DialogHeader>
        <DialogFooter>
          {/* <DialogClose asChild> */}
            <Button type="submit" onClick={handleCopy}>
              <Copy /> Copiar
            </Button>
          {/* </DialogClose> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
