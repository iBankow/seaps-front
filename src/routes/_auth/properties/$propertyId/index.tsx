import { createFileRoute, Link, useLoaderData } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  MapPin,
  Building,
  User,
  Calendar,
  CheckSquare,
  Plus,
  Eye,
  Edit,
  TrendingUp,
  BarChart3,
  FileCheck,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/contexts/auth-contexts";
import { api } from "@/lib/api";
import { formatPhone } from "@/lib/utils";
import { BackButton } from "@/components/back-button";

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

interface ChecklistSummary {
  id: string;
  status: string;
  created_at: string;
  user_name: string;
  completion_percentage: number;
  total_items: number;
  good_items: number;
  regular_items: number;
  bad_items: number;
  na_items: number;
}

interface PropertyStats {
  total_checklists: number;
  open_checklists: number;
  closed_checklists: number;
  canceled_checklists: number;
  avg_completion: number;
  recent_checklists: ChecklistSummary[];
}

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
    role: string;
    phone: string;
    email: string;
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
  const [stats, setStats] = useState<PropertyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState({
    name: "",
    role: "",
    phone: "",
    email: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPropertyStats = async () => {
      try {
        // Buscar checklists relacionados a esta propriedade
        const response = await api.get("/api/v1/checklists", {
          params: { property_name: property?.name, limit: 999 },
        });

        const checklists = response.data.data || [];

        const total_checklists = checklists.length;
        const open_checklists = checklists.filter(
          (c: any) => c.status === "OPEN"
        ).length;
        const closed_checklists = checklists.filter(
          (c: any) => c.status === "CLOSED"
        ).length;
        const canceled_checklists = checklists.filter(
          (c: any) => c.status === "CANCELED"
        ).length;

        // Calcular estatísticas dos checklists mais recentes
        const recent_checklists = await Promise.all(
          checklists.slice(0, 5).map(async (checklist: any) => {
            try {
              const itemsResponse = await api.get(
                `/api/v1/checklists/${checklist.id}/items`
              );
              const items = itemsResponse.data || [];

              const total_items = items.length;
              const good_items = items.filter(
                (item: any) => item.score === 3
              ).length;
              const regular_items = items.filter(
                (item: any) => item.score === 1
              ).length;
              const bad_items = items.filter(
                (item: any) => item.score === -2
              ).length;
              const na_items = items.filter(
                (item: any) => item.score === 0
              ).length;
              const completed_items = items.filter(
                (item: any) => item.score !== null
              ).length;
              const completion_percentage =
                total_items > 0 ? (completed_items / total_items) * 100 : 0;

              return {
                id: checklist.id,
                status: checklist.status,
                created_at: checklist.created_at,
                user_name: checklist.user?.name || "N/A",
                completion_percentage,
                total_items,
                good_items,
                regular_items,
                bad_items,
                na_items,
              };
            } catch {
              return {
                id: checklist.id,
                status: checklist.status,
                created_at: checklist.created_at,
                user_name: checklist.user_name || "N/A",
                completion_percentage: 0,
                total_items: 0,
                good_items: 0,
                regular_items: 0,
                bad_items: 0,
                na_items: 0,
              };
            }
          })
        );

        const avg_completion =
          recent_checklists.length > 0
            ? recent_checklists.reduce(
                (acc, c) => acc + c.completion_percentage,
                0
              ) / recent_checklists.length
            : 0;

        setStats({
          total_checklists,
          open_checklists,
          closed_checklists,
          canceled_checklists,
          avg_completion,
          recent_checklists,
        });
      } catch (error) {
        console.error("Erro ao buscar estatísticas da propriedade:", error);
        setStats({
          total_checklists: 0,
          open_checklists: 0,
          closed_checklists: 0,
          canceled_checklists: 0,
          avg_completion: 0,
          recent_checklists: [],
        });
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchPropertyStats();
    }
  }, [propertyId]);

  const getStatusBadge = (status: string) => {
    const variants = {
      OPEN: { variant: "default" as const, label: "Em Andamento" },
      CLOSED: { variant: "secondary" as const, label: "Finalizado" },
      CANCELED: { variant: "destructive" as const, label: "Cancelado" },
    };

    const config = variants[status as keyof typeof variants] || {
      variant: "default" as const,
      label: status,
    };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleEditPerson = () => {
    if (property?.person) {
      setEditingPerson({
        name: property.person.name || "",
        role: property.person.role || "",
        phone: formatPhone(property.person.phone || ""),
        email: property.person.email || "",
      });
      setEditDialogOpen(true);
    }
  };

  const handleSavePerson = async () => {
    console.log(property?.person);

    if (!property?.person?.id) return;

    setSaving(true);
    try {
      await api.put(`/api/v1/persons/${property.person.id}`, editingPerson);

      // Atualizar o estado local da propriedade
      if (property.person) {
        property.person = {
          ...property.person,
          ...editingPerson,
          phone: editingPerson.phone.replace(/\D/g, ""),
        };
      }

      setEditDialogOpen(false);
      // Opcional: mostrar toast de sucesso
    } catch (error) {
      console.error("Erro ao salvar informações da pessoa:", error);
      // Opcional: mostrar toast de erro
    } finally {
      setSaving(false);
    }
  };

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
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BackButton variant={`outline`} />
              <div>
                <h1 className="text-3xl font-bold">{property.name}</h1>
                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4" />
                  {property.address}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={PROPERTY_TYPE_ENUM[property.type].style}>
                {PROPERTY_TYPE_ENUM[property.type].label}
              </Badge>
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
          </div>
        </CardContent>
      </Card>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Checklists
            </CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats?.total_checklists || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Avaliações realizadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {loading ? "..." : stats?.open_checklists || 0}
            </div>
            <p className="text-xs text-muted-foreground">Checklists abertos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Finalizados</CardTitle>
            <CheckSquare className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {loading ? "..." : stats?.closed_checklists || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Avaliações completas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Progresso Médio
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : `${Math.round(stats?.avg_completion || 0)}%`}
            </div>
            <Progress value={stats?.avg_completion || 0} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Média de conclusão
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Property and Additional Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Informações do Imóvel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Nome
                </p>
                <p className="text-lg">{property.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Tipo
                </p>
                <div className="mt-1">
                  <Badge className={PROPERTY_TYPE_ENUM[property.type].style}>
                    {PROPERTY_TYPE_ENUM[property.type].label}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Organização
                </p>
                <p>{property.organization?.name}</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Endereço
                </p>
                <p>{property.address}</p>
              </div>

              {property.coordinates && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Coordenadas
                  </p>
                  <p className="text-sm font-mono">{property.coordinates}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações Adicionais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {property.person && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Responsável pelo Imóvel
                      </p>
                      <p className="text-lg font-medium">
                        {property.person.name}
                      </p>
                    </div>
                    {user?.role !== "EVALUATOR" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEditPerson}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    )}
                  </div>

                  {property.person.role && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Cargo/Função
                      </p>
                      <p className="text-sm">{property.person.role}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    {property.person.phone && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Telefone
                        </p>
                        <p className="text-sm font-mono">
                          {formatPhone(property.person.phone)}
                        </p>
                      </div>
                    )}

                    {property.person.email && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Email
                        </p>
                        <p className="text-sm font-mono break-all">
                          {property.person.email}
                        </p>
                      </div>
                    )}
                  </div>

                  <Separator />
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Data de Criação
                </p>
                <p className="flex items-center gap-2">
                  {format(
                    new Date(property.created_at),
                    "dd 'de' MMMM 'de' yyyy",
                    { locale: ptBR }
                  )}
                </p>
              </div>

              {property.updated_at && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Última Atualização
                  </p>
                  <p>
                    {format(
                      new Date(property.updated_at),
                      "dd/MM/yyyy 'às' HH:mm"
                    )}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Checklists */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Checklists Recentes
              </CardTitle>
              <CardDescription>
                Últimas avaliações realizadas neste imóvel
              </CardDescription>
            </div>
            <Button asChild>
              <Link to="/checklists/create">
                <Plus className="h-4 w-4 mr-2" />
                Novo Checklist
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="space-y-2">
                    <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                  </div>
                  <div className="h-6 w-20 animate-pulse rounded bg-muted" />
                </div>
              ))}
            </div>
          ) : stats?.recent_checklists.length === 0 ? (
            <div className="text-center py-12">
              <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Nenhum checklist encontrado para este imóvel.
              </p>
              <Button asChild>
                <Link to="/checklists/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Checklist
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {stats?.recent_checklists.map((checklist) => (
                <div
                  key={checklist.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">
                            Checklist • {checklist.user_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {format(
                              new Date(checklist.created_at),
                              "dd/MM/yyyy 'às' HH:mm"
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(checklist.status)}
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            to="/checklists/$checklistId"
                            params={{ checklistId: checklist.id }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Link>
                        </Button>
                      </div>
                    </div>

                    {checklist.total_items > 0 && (
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Progresso</span>
                          <span>
                            {Math.round(checklist.completion_percentage)}%
                          </span>
                        </div>
                        <Progress
                          value={checklist.completion_percentage}
                          className="h-2"
                        />
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            {checklist.good_items} BOM
                          </span>
                          <span className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                            {checklist.regular_items} REGULAR
                          </span>
                          <span className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                            {checklist.bad_items} RUIM
                          </span>
                          <span className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full" />
                            {checklist.na_items} N/A
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {(stats?.total_checklists || 0) > 5 && (
                <div className="text-center pt-4">
                  <Button variant="outline" asChild>
                    <Link
                      to="/checklists"
                      search={{ property_name: property.name }}
                    >
                      Ver Todos os Checklists
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Edição do Responsável */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Responsável</DialogTitle>
            <DialogDescription>
              Altere as informações do responsável pelo imóvel.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={editingPerson.name}
                onChange={(e) =>
                  setEditingPerson((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Cargo
              </Label>
              <Input
                id="role"
                value={editingPerson.role}
                onChange={(e) =>
                  setEditingPerson((prev) => ({
                    ...prev,
                    role: e.target.value,
                  }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Telefone
              </Label>
              <Input
                id="phone"
                value={editingPerson.phone}
                onChange={(e) =>
                  setEditingPerson((prev) => ({
                    ...prev,
                    phone: formatPhone(e.target.value),
                  }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={editingPerson.email}
                onChange={(e) =>
                  setEditingPerson((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={handleSavePerson} disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
