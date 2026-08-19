import { createFileRoute } from "@tanstack/react-router";
import { useChecklist } from "@/contexts/checklist-context";
import { useCan } from "@/features/auth";
import {
  useChecklistNotification,
  useGenerateChecklistNotification,
} from "@/features/checklist-notifications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { formatDateTimeLong } from "@/lib/format";
import Markdown from "react-markdown";

export const Route = createFileRoute(
  "/_auth/checklists/$checklistId/notification/",
)({
  component: RouteComponent,
  loader: () => ({
    crumb: "Notificação",
  }),
});

function RouteComponent() {
  const { checklist } = useChecklist();
  const { checklistId } = Route.useParams();
  const can = useCan();

  const { data: notification, isLoading } =
    useChecklistNotification(checklistId);
  const generateMutation = useGenerateChecklistNotification();

  const canGenerate = can("checklist:generate_notification");

  const handleGenerate = () => {
    toast.promise(generateMutation.mutateAsync(checklistId), {
      loading: notification
        ? "Regerando notificação..."
        : "Gerando notificação...",
      success: notification
        ? "Notificação regerada com sucesso!"
        : "Notificação gerada com sucesso!",
      error: (error) =>
        error?.response?.data?.message || "Erro ao gerar a notificação",
    });
  };

  if (checklist.status === "OPEN") {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          A notificação só pode ser gerada após o checklist ser finalizado.
        </CardContent>
      </Card>
    );
  }

  if (checklist.classification === 2) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Notificação não é gerada para checklists com classificação "Bom".
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Notificação
        </CardTitle>
        {canGenerate && (
          <Button
            onClick={handleGenerate}
            disabled={generateMutation.isPending}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {notification ? "Regerar Notificação" : "Gerar Notificação"}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {notification ? (
          <>
            <p className="text-xs text-muted-foreground mb-4">
              Atualizado em {formatDateTimeLong(notification.updated_at)}
            </p>
            <div className="text-sm border rounded-md p-4 bg-muted/30">
              <Markdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-lg font-semibold mb-3">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-base font-semibold mt-5 mb-2 first:mt-0">
                      {children}
                    </h2>
                  ),
                  p: ({ children }) => (
                    <p className="mb-3 leading-relaxed last:mb-0">{children}</p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-foreground">
                      {children}
                    </strong>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 pl-3 my-3 text-muted-foreground italic">
                      {children}
                    </blockquote>
                  ),
                  hr: () => <hr className="my-4 border-border" />,
                  em: ({ children }) => (
                    <em className="italic text-muted-foreground">{children}</em>
                  ),
                  a: ({ children, href }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline hover:text-primary/80"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {notification.content}
              </Markdown>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground text-center py-12">
            {canGenerate
              ? "Nenhuma notificação foi gerada para este checklist ainda."
              : "Nenhuma notificação foi gerada para este checklist ainda. Você não tem permissão para gerá-la."}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
