import type { UseFormReturn } from "react-hook-form";
import { Building2, MapPin, User } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";
import type {
  PropertyFormDataType,
  PropertyFormSchemaType,
} from "./create-property-wizard";

interface ReviewFormProps {
  form: UseFormReturn<PropertyFormSchemaType>;
  formData: PropertyFormDataType | null;
}

const TypeLabel = {
  OWN: "PRÓPRIO",
  RENTED: "ALUGADO",
  GRANT: "CEDIDO",
};

export const ReviewForm = ({ form, formData }: ReviewFormProps) => {
  const values = form.getValues();

  return (
    <div className="flex w-full flex-col items-center">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Revisão dos Dados</CardTitle>
          <CardDescription>
            Confirme se os dados estão corretos antes de criar o imóvel.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <div className="bg-muted/50 flex w-full items-center gap-4 rounded-lg p-4">
            <div className="bg-background flex h-12 w-12 items-center justify-center rounded-lg">
              <Building2 className="text-primary size-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-base font-semibold">
                Dados Básicos
              </div>
              <div className="text-muted-foreground mt-1 text-sm">
                Nome: {values.name}
                <br />
                Tipo: {TypeLabel[values.type as keyof typeof TypeLabel] || "--"}
                <br />
                Orgão: {formData?.organization?.name || "--"}
              </div>
            </div>
          </div>

          <div className="bg-muted/50 flex w-full items-center gap-4 rounded-lg p-4">
            <div className="bg-background flex h-12 w-12 items-center justify-center rounded-lg">
              <User className="text-primary size-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-base font-semibold">
                Responsável
              </div>
              <div className="text-muted-foreground mt-1 text-sm">
                {formData?.person?.name || "--"}
              </div>
            </div>
          </div>

          <div className="bg-muted/50 flex w-full items-center gap-4 rounded-lg p-4">
            <div className="bg-background flex h-12 w-12 items-center justify-center rounded-lg">
              <MapPin className="text-primary size-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-base font-semibold">
                Endereço
              </div>
              <div className="text-muted-foreground mt-1 text-sm">
                CEP: {values.cep}
                <br />
                {values.street}, {values.number || "S/N"}
                <br />
                {values.neighborhood} - {values.city}/{values.state}
                <br />
                {values.address}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
