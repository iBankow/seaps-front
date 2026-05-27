import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { BackButton } from "@/components/back-button";
import { EditPropertyForm } from "@/features/properties/ui/edit-form";
import { useProperty } from "@/features/properties/api/properties";

export const Route = createFileRoute("/_auth/properties/$propertyId/edit/")({
  component: EditProperty,
  loader: () => ({ crumb: "Editar" }),
});

function EditProperty() {
  const { propertyId } = Route.useParams();

  const { data, isLoading, error } = useProperty(propertyId);

  const property = data;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <BackButton variant={"ghost"} />
          </Button>
          <div className="h-6 w-48 animate-pulse rounded bg-gray-200"></div>
        </div>
        <Card>
          <CardHeader>
            <div className="h-6 w-32 animate-pulse rounded bg-gray-200"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-10 w-full animate-pulse rounded bg-gray-200"></div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!property || error) {
    return (
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <BackButton variant={"ghost"} />
          </Button>
          <h1 className="text-2xl font-bold">Imóvel não encontrado</h1>
        </div>
        <Card>
          <CardContent>
            <p>O imóvel que você está tentando editar não foi encontrado.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-4">
      <Card>
        <CardContent>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <BackButton variant={"ghost"} />
            </Button>
            <h1 className="text-2xl font-bold">Editar Imóvel</h1>
          </div>
        </CardContent>
      </Card>

      <EditPropertyForm property={property} />
    </div>
  );
}
