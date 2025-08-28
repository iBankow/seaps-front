import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { ArrowLeft } from "lucide-react";

import { PropertyForm } from "../../-components/form";

export const Route = createFileRoute("/_auth/properties/$propertyId/edit/")({
  component: EditProperty,
  loader: () => ({ crumb: "Editar" }),
});

function EditProperty() {
  const { propertyId } = Route.useParams();

  const [property, setProperty] = useState();
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data } = await api.get(`/api/v1/properties/${propertyId}`);

        if (data) {
          setProperty(data);
        }
      } finally {
        setDataLoading(false);
      }
    };

    loadData();
  }, [propertyId]);

  if (dataLoading) {
    return (
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`..`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
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

  return (
    <div className="flex flex-col gap-y-4">
      <Card>
        <CardContent>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to={`..`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Editar Imóvel</h1>
          </div>
        </CardContent>
      </Card>

      <PropertyForm property={property} />
    </div>
  );
}
