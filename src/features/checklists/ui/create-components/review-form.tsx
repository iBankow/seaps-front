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
    <div className="w-full items-center flex flex-col">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Revisão dos Dados</CardTitle>
          <CardDescription>
            Confirme se os dados estão corretos antes de criar o checklist.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          {/* MODELO: */}
          <div className="flex gap-4 sm:flex-row flex-col">
            <div className="bg-muted/50 flex items-center w-full gap-4 rounded-lg p-4">
              <div className="bg-background flex h-12 w-12 items-center justify-center rounded-lg">
                <Package className="text-primary size-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-base font-semibold">
                  Modelo Selecionado
                </div>
                <div className="text-muted-foreground mt-1 text-sm">
                  {formData.model?.name}
                </div>
              </div>
            </div>

            <div className="bg-muted/50 flex items-center w-full gap-4 rounded-lg p-4">
              <div className="bg-background flex h-12 w-12 items-center justify-center rounded-lg">
                <FileText className="text-primary size-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-base font-semibold">
                  {isReturned ? "Checklist de Retorno" : "Checklist Padrão"}
                </div>
                <div className="text-muted-foreground mt-1 text-sm">
                  {returnValue ? `${returnValue}° Retorno` : "--"}
                </div>
              </div>
            </div>
          </div>

          {/* ORGANIZACAO: */}
          <div className="bg-muted/50 flex items-center w-full gap-4 rounded-lg p-4">
            <div className="bg-background flex h-12 w-12 items-center justify-center rounded-lg">
              <Landmark className="text-primary size-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-base font-semibold">
                Organização Selecionada
              </div>
              <div className="text-muted-foreground mt-1 text-sm">
                {formData.organization?.name || "--"}
              </div>
            </div>
          </div>

          {/* IMOVEL: */}

          <div className="bg-muted/50 flex items-center w-full gap-4 rounded-lg p-4">
            <div className="bg-background flex h-12 w-12 items-center justify-center rounded-lg">
              <Landmark className="text-primary size-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-base font-semibold">
                Imóvel Selecionado
              </div>
              <div className="text-muted-foreground mt-1 text-sm">
                {formData.property?.name || "--"}
                <br />
                {formData.property?.address || "--"}
              </div>
            </div>
          </div>

          {/* RESPONSAVEL: */}

          <div className="bg-muted/50 flex items-center w-full gap-4 rounded-lg p-4">
            <div className="bg-background flex h-12 w-12 items-center justify-center rounded-lg">
              <User className="text-primary size-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-base font-semibold">
                Responsável Selecionado
              </div>
              <div className="text-muted-foreground mt-1 text-sm">
                {formData.user?.name || "--"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
