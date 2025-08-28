import { createFileRoute, Link, useLoaderData } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, Building, User, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/auth-contexts";

export const Route = createFileRoute("/_auth/properties/$propertyId/")({
  component: PropertyDetail,
});

const PROPERTY_TYPE_ENUM = {
  OWN: {
    label: "PRÓPRIO",
    style: "border-blue-800 bg-blue-200 text-blue-900 hover:bg-blue-200/80",
  },
  RENTED: {
    label: "ALUGADO",
    style: "border-green-800 bg-green-200 text-green-900 hover:bg-green-200/80",
  },
  GRANT: {
    label: "CEDIDO",
    style:
      "border-purple-800 bg-purple-200 text-purple-900 hover:bg-purple-200/80",
  },
};

type PROPERTY_TYPE = "OWN" | "RENTED" | "GRANT";

interface Property {
  id: string;
  name: string;
  type: PROPERTY_TYPE;
  address?: string;
  cep?: string;
  state?: string;
  city?: string;
  neighborhood?: string;
  street?: string;
  coordinates?: string;
  created_at: string;
  updated_at?: string;
  organization: {
    id: string;
    name: string;
  };
  person?: {
    id: string;
    name: string;
  };
  user?: {
    id: string;
    name: string;
  };
}

function PropertyDetail() {
  const { propertyId } = Route.useParams();
  const { data } = useLoaderData({ from: "/_auth/properties/$propertyId" });
  const { user } = useAuth();
  const [property] = useState<Property | null>(data || null);

  if (!property) {
    return (
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/properties">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Imóvel não encontrado</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-4">
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/properties">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-2xl font-bold">{property.name}</h1>
            </div>
            {user?.role !== "EVALUATOR" && (
              <Button asChild>
                <Link
                  to={`/properties/$propertyId/edit`}
                  params={{ propertyId }}
                >
                  Editar Imóvel
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Informações do Imóvel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Nome</label>
              <p className="text-lg font-semibold">{property.name}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Tipo</label>
              <div className="mt-1">
                <Badge className={PROPERTY_TYPE_ENUM[property.type].style}>
                  {PROPERTY_TYPE_ENUM[property.type].label}
                </Badge>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Orgão</label>
              <p className="text-lg">{property.organization?.name}</p>
            </div>

            <Separator />

            <div>
              <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Endereço
              </label>
              <p className="text-lg">{property.address}</p>
            </div>

            {property.coordinates && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Coordenadas
                </label>
                <p className="text-sm font-mono">{property.coordinates}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações Adicionais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {property.person && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Responsável
                </label>
                <p className="text-lg">{property.person.name}</p>
              </div>
            )}

            {property.user && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Criado por
                </label>
                <p className="text-lg">{property.user.name}</p>
              </div>
            )}

            <Separator />

            <div>
              <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Criado em
              </label>
              <p className="text-lg">
                {format(new Date(property.created_at), "dd/MM/yyyy 'às' HH:mm")}
              </p>
            </div>

            {property.updated_at && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Atualizado em
                </label>
                <p className="text-lg">
                  {format(
                    new Date(property.updated_at),
                    "dd/MM/yyyy 'às' HH:mm"
                  )}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
