import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Calendar, Mail, Shield } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/auth-contexts";

export const Route = createFileRoute("/_auth/users/$userId/")({
  component: UserDetail,
});

const ROLE_ENUM = {
  ADMIN: {
    label: "ADMINISTRADOR",
    style: "border-red-800 bg-red-200 text-red-900 hover:bg-red-200/80",
  },
  MANAGER: {
    label: "GERENTE",
    style: "border-blue-800 bg-blue-200 text-blue-900 hover:bg-blue-200/80",
  },
  EVALUATOR: {
    label: "AVALIADOR",
    style: "border-green-800 bg-green-200 text-green-900 hover:bg-green-200/80",
  },
  USER: {
    label: "USUÁRIO",
    style: "border-gray-800 bg-gray-200 text-gray-900 hover:bg-gray-200/80",
  },
};

type ROLE_TYPE = "ADMIN" | "MANAGER" | "EVALUATOR" | "USER";

interface IUser {
  id: string;
  name: string;
  email: string;
  role: ROLE_TYPE;
  is_active: boolean;
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
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/users">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="h-6 w-48 animate-pulse rounded bg-gray-200"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="h-6 w-32 animate-pulse rounded bg-gray-200"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/users">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Usuário não encontrado</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/users">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{userData.name}</h1>
        </div>
        {user?.role !== "EVALUATOR" && (
          <Button asChild>
            <Link to={`/users/$userId/edit`} params={{ userId }}>
              Editar Usuário
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações do Usuário
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Nome</label>
              <p className="text-lg font-semibold">{userData.name}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                <Mail className="h-4 w-4" />
                Email
              </label>
              <p className="text-lg">{userData.email}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                <Shield className="h-4 w-4" />
                Função
              </label>
              <div className="mt-1">
                <Badge className={ROLE_ENUM[userData.role as "ADMIN"].style}>
                  {ROLE_ENUM[userData.role as "ADMIN"].label}
                </Badge>
              </div>
            </div>
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
            <div>
              <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                Status
              </label>
              <p
                className={`text-lg font-semibold ${userData.is_active ? "text-green-700" : "text-red-700"}`}
              >
                {userData.is_active ? "ATIVO" : "INATIVO"}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Criado em
              </label>
              <p className="text-lg">
                {format(new Date(userData.created_at), "dd/MM/yyyy 'às' HH:mm")}
              </p>
            </div>

            {userData.updated_at && (
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Atualizado em
                </label>
                <p className="text-lg">
                  {format(
                    new Date(userData.updated_at),
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
