import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  User,
  Calendar,
  Mail,
  Shield,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/contexts/auth-contexts";
import { can } from "@/lib/permissions";

export const Route = createFileRoute("/_auth/users/$userId/")({
  component: UserDetail,
  loader: () => ({
    crumb: "Usuário",
  }),
});

interface IUser {
  id: string;
  name: string;
  email: string;
  permissions: string[];
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

function UserDetail() {
  const { userId } = Route.useParams();
  const { user } = useAuth();
  const [userData, setUserData] = useState<IUser>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/api/v1/users/${userId}`)
      .then(({ data }) => {
        setUserData(data);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/users">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="space-y-2 flex-1">
            <div className="h-8 w-64 animate-pulse rounded bg-muted"></div>
            <div className="h-4 w-32 animate-pulse rounded bg-muted"></div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <div className="h-6 w-48 animate-pulse rounded bg-muted"></div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
                  <div className="h-4 w-3/4 animate-pulse rounded bg-muted"></div>
                  <div className="h-4 w-1/2 animate-pulse rounded bg-muted"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/users">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-destructive">
            Usuário não encontrado
          </h1>
        </div>
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>O usuário solicitado não foi encontrado ou foi removido.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/users">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {userData.name}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Detalhes e informações do usuário
            </p>
          </div>
        </div>
        {can(["users:edit"], user?.permissions) && (
          <Button asChild size="lg">
            <Link to={`/users/$userId/edit`} params={{ userId }}>
              Editar Usuário
            </Link>
          </Button>
        )}
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-2">
        {userData.is_active ? (
          <Badge
            variant="default"
            className="bg-green-500 hover:bg-green-600 gap-1"
          >
            <CheckCircle2 className="h-3 w-3" />
            Ativo
          </Badge>
        ) : (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Inativo
          </Badge>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Informações do Usuário */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 text-primary" />
              Informações do Usuário
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Nome Completo
              </label>
              <p className="text-base font-medium">{userData.name}</p>
            </div>

            <Separator />

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                E-mail
              </label>
              <p className="text-base font-medium break-all">
                {userData.email}
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                Permissões
              </label>
              <div className="flex flex-wrap gap-2">
                {userData.permissions && userData.permissions.length > 0 ? (
                  userData.permissions.map((permission) => (
                    <Badge
                      key={permission}
                      variant="secondary"
                      className="text-xs"
                    >
                      {permission.replace(/_/g, " ")}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Nenhuma permissão atribuída
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações Adicionais */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 text-primary" />
              Informações do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Status da Conta
              </label>
              <div className="flex items-center gap-2">
                {userData.is_active ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-base font-semibold text-green-700">
                      Conta Ativa
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span className="text-base font-semibold text-red-700">
                      Conta Inativa
                    </span>
                  </>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Criado em
              </label>
              <p className="text-base font-medium">
                {format(
                  new Date(userData.created_at || new Date()),
                  "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
                  { locale: ptBR },
                )}
              </p>
            </div>

            {userData.updated_at && (
              <>
                <Separator />
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Última Atualização
                  </label>
                  <p className="text-base font-medium">
                    {format(
                      new Date(userData.updated_at),
                      "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
                      { locale: ptBR },
                    )}
                  </p>
                </div>
              </>
            )}

            <Separator />

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                ID do Usuário
              </label>
              <p className="text-xs font-mono bg-muted px-2 py-1 rounded border">
                {userData.id}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
