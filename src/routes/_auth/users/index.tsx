import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, UserCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersTab } from "./-components/users-tab";
import { RequestsTab } from "./-components/requests-tab";

export const Route = createFileRoute("/_auth/users/")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): any => {
    return {
      page: search.page || 1,
      per_page: search.per_page || 10,
      organization: search.organization,
      role: search.role,
      name: search.name,
      email: search.email,
      status: search.status,
      user_name: search.user_name,
      tab: search.tab || "users",
    };
  },
});

export function RouteComponent() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const handleTabChange = (value: string) => {
    navigate({
      to: "/users",
      search: {
        page: 1,
        per_page: search.per_page || 10,
        tab: value,
      },
      replace: true,
    });
  };

  return (
    <div className="flex flex-col gap-y-6">
      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Users className="h-8 w-8 text-primary" />
                Gerenciamento de Usuários
              </CardTitle>
              <CardDescription className="text-base">
                Gerencie usuários do sistema e solicitações de ativação
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="shadow-sm">
        <Tabs
          value={search.tab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <CardHeader className="pb-3 w-full">
            <TabsList className="grid w-full grid-cols-2 h-11">
              <TabsTrigger value="users" className="gap-2 w-full">
                <Users className="h-4 w-4" />
                Usuários
              </TabsTrigger>
              <TabsTrigger value="requests" className="gap-2 w-full">
                <UserCheck className="h-4 w-4" />
                Solicitações de Ativação
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <TabsContent value="users" className="mt-0">
            <UsersTab search={search} />
          </TabsContent>

          <TabsContent value="requests" className="mt-0">
            <RequestsTab search={search} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
