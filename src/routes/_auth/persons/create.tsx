import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import z from "zod";
import { CreatePersonForm } from "./-components/form";

const SearchSchema = z.object({
  organization_id: z.string().optional(),
});

export const Route = createFileRoute("/_auth/persons/create")({
  component: RouteComponent,
  loader: () => {
    return {
      crumb: "Criar",
    };
  },
  validateSearch: SearchSchema,
});

function RouteComponent() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-y-4">
      <Card>
        <CardContent>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="cursor-pointer"
              size="sm"
              onClick={() => router.history.back()}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Criar Novo Responsável</h1>
          </div>
        </CardContent>
      </Card>
      <CreatePersonForm />
    </div>
  );
}
