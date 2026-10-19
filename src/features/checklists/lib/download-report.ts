import { http as api } from "@/lib/http";
import { toast } from "sonner";

/**
 * Baixa o relatório em PDF de um checklist. Extraído do menu de ações da
 * listagem para que o card de detalhe use o mesmo caminho — o nome do arquivo
 * e o tratamento de erro precisam bater nos dois lugares.
 */
export function downloadChecklistReport(checklist: { id: string; sid: string }) {
  toast.promise(
    api.get("/reports/" + checklist.id, {
      responseType: "blob",
      skipErrorToast: true,
    }),
    {
      loading: "Carregando relatório...",
      success: (response: { data: BlobPart }) => {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `${checklist.sid.replace("/", "_")}.pdf`;
        anchor.click();
        window.URL.revokeObjectURL(url);

        return "Relatório gerado com sucesso";
      },
      error: "Erro ao gerar relatório",
    },
  );
}
