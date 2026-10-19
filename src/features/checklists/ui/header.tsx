import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MetaField } from "@/components/common/meta-field";
import { PageHeader } from "@/components/layout/page-header";
import type { HeaderTone } from "@/components/layout/page-header-context";
import { useChecklist } from "@/contexts/checklist-context";
import { useChecklistsItems } from "@/features/checklist-items";
import { formatDate } from "@/lib/format";
import { StatusBadge } from "./status-badge";
import { getStatusTone } from "./status-colors";
import { ChecklistHeaderActions } from "./header-actions";

/** O tom do status vira a cor da régua de 3px sob o header da página. */
const TONE_TO_HEADER: Record<string, HeaderTone> = {
  success: "success",
  destructive: "destructive",
  purple: "validated",
  muted: "muted",
  primary: "brand",
};

/**
 * Card de detalhe do checklist, do design "Painel SIMP": identificação e
 * metadados à esquerda, preenchimento e ações à direita. Fica no layout da
 * rota, então acompanha todas as telas do checklist.
 */
export const ChecklistHeader = () => {
  const { checklist } = useChecklist();
  const { data: items } = useChecklistsItems(checklist?.id);

  const total = items.length;
  const done = items.filter((item) => item.score !== null).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  // A relação do modelo nem sempre vem embutida no detalhe, então o campo só
  // aparece quando existe — evita renderizar "MODELO —" à toa.
  const modelName = checklist.model?.name;

  return (
    <>
      <PageHeader
        eyebrow={`Checklists · ${checklist.sid}`}
        title={checklist.property?.name ?? "Checklist"}
        tone={TONE_TO_HEADER[getStatusTone(checklist.status)] ?? "brand"}
      />

      <Link
        to="/checklists"
        className="font-heading mb-3.5 inline-block text-[10px] font-semibold tracking-[0.11em] text-primary uppercase hover:text-primary/80"
      >
        ← voltar para checklists
      </Link>

      <Card className="mb-3.5 flex-row flex-wrap items-start gap-6 p-[22px]">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-xs text-muted-foreground">
              {checklist.sid}
            </span>
            <span aria-hidden className="h-3 w-px bg-input" />
            <span className="font-heading text-[11px] font-semibold tracking-[0.09em] uppercase">
              {checklist.organization?.acronym ?? checklist.organization?.name}
            </span>
            <StatusBadge status={checklist.status} />
          </div>

          <h2 className="font-heading mt-2.5 text-2xl leading-tight font-bold tracking-[0.01em] uppercase">
            {checklist.property?.name}
          </h2>
          <p className="mt-1.5 text-xs text-muted-foreground">
            {checklist.property?.address}
          </p>

          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
            <MetaField label="Responsável">
              {checklist.property?.person?.name ?? "—"}
            </MetaField>
            <MetaField label="Avaliador">
              {checklist.user?.name ?? "—"}
            </MetaField>
            {modelName && <MetaField label="Modelo">{modelName}</MetaField>}
            <MetaField label="Abertura">
              <span className="font-mono text-xs text-muted-foreground">
                {formatDate(checklist.created_at)}
              </span>
            </MetaField>
          </div>
        </div>

        <div className="w-[238px] shrink-0">
          <div className="font-mono text-[9.5px] tracking-[0.12em] text-muted-foreground uppercase">
            Preenchimento
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-heading text-[30px] leading-none font-bold">
              {pct}%
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {done}/{total} itens
            </span>
          </div>
          <Progress value={pct} tone="success" className="mt-2.5 h-2" />

          <ChecklistHeaderActions />
        </div>
      </Card>
    </>
  );
};
