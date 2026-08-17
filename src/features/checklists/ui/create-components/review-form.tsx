import type { ReactNode } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { FormDataType, FormSchemaType } from "./create-checklist-wizard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Landmark, Package, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const ReviewForm = ({
  form,
  formData,
}: {
  form: UseFormReturn<FormSchemaType>;
  formData: FormDataType | null;
}) => {
  if (!formData) {
    return <div>Carregando...</div>;
  }

  const isReturned = form.getValues("is_returned");
  const returnValue = form.getValues("return");

  return (
    <div className="flex w-full flex-col items-center">
      <Card className="w-full max-w-3xl gap-4 p-[20px_22px]">
        <CardHeader className="p-0">
          <CardTitle className="font-heading text-xs font-bold tracking-widest uppercase">
            Revisão dos dados
          </CardTitle>
          <CardDescription className="text-[11px] text-muted-foreground">
            Confirme se os dados estão corretos antes de criar o checklist.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-2.5 p-0">
          {/* MODELO: */}
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <ReviewTile icon={Package} label="Modelo selecionado">
              <span className="font-heading text-[13px] font-semibold tracking-wide uppercase">
                {formData.model?.name || "--"}
              </span>
            </ReviewTile>

            <ReviewTile
              icon={FileText}
              label={isReturned ? "Checklist de retorno" : "Checklist padrão"}
            >
              {returnValue ? (
                <span className="font-mono text-[12px]">
                  {returnValue}° retorno
                </span>
              ) : (
                <span className="text-muted-foreground">--</span>
              )}
            </ReviewTile>
          </div>

          {/* ORGANIZACAO: */}
          <ReviewTile icon={Landmark} label="Organização selecionada">
            <span className="font-heading text-[13px] font-semibold tracking-wide uppercase">
              {formData.organization?.name || "--"}
            </span>
          </ReviewTile>

          {/* IMOVEL: */}
          <ReviewTile icon={Landmark} label="Imóvel selecionado">
            <span className="font-heading text-[13px] font-semibold tracking-wide uppercase">
              {formData.property?.name || "--"}
            </span>
            <span className="mt-0.5 block text-[12px] text-muted-foreground">
              {formData.property?.address || "--"}
            </span>
          </ReviewTile>

          {/* RESPONSAVEL: */}
          <ReviewTile icon={User} label="Responsável selecionado">
            {formData.user?.name || "--"}
          </ReviewTile>
        </CardContent>
      </Card>
    </div>
  );
};

/**
 * Linha de revisão no padrão "Painel SIMP": quadrado de ícone à esquerda,
 * caption mono uppercase e o valor confirmado logo abaixo.
 */
const ReviewTile = ({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
}) => (
  <div className="flex w-full items-center gap-3.5 rounded-xl bg-secondary p-3.5">
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-card ring-1 ring-foreground/10">
      <Icon className="size-5 text-primary" />
    </div>
    <div className="min-w-0 flex-1">
      <div className="font-mono text-[9.5px] tracking-[0.12em] text-muted-foreground uppercase">
        {label}
      </div>
      <div className="mt-1.5 text-[13px] leading-snug">{children}</div>
    </div>
  </div>
);
