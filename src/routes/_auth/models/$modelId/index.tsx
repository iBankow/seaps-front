import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  FileText,
  Calendar,
  Building,
  CheckSquare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BackButton } from "@/components/back-button";

export const Route = createFileRoute("/_auth/models/$modelId/")({
  component: RouteComponent,
});

interface ModelItem {
  id: string;
  name: string;
}

interface Model {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  items: ModelItem[];
}

function RouteComponent() {
  const { modelId } = Route.useParams();
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get(`/api/v1/models/${modelId}`);
        setModel(data);
      } catch (err) {
        console.error("Erro ao carregar modelo:", err);
        setError("Erro ao carregar o modelo. Verifique se o ID está correto.");
      } finally {
        setLoading(false);
      }
    };

    if (modelId) {
      loadModel();
    }
  }, [modelId]);

  if (loading) {
    return (
      <div className="flex flex-col gap-y-4 flex-1">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-4 w-4 animate-pulse rounded bg-muted" />
              <div className="h-6 w-48 animate-pulse rounded bg-muted" />
            </div>
            <div className="space-y-4">
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-y-4 flex-1">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BackButton />
              <h1 className="text-2xl font-bold text-red-600">Erro</h1>
            </div>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="flex flex-col gap-y-4 flex-1">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/models">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-2xl font-bold">Modelo não encontrado</h1>
            </div>
            <p className="text-muted-foreground">
              O modelo solicitado não foi encontrado.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col gap-y-4 flex-1">
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/models">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  Pré-visualização do Modelo
                </h1>
                <p className="text-sm text-muted-foreground">
                  Visualize como este modelo aparecerá nos checklists
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/models/$modelId/edit" params={{ modelId }}>
                  Editar Modelo
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Informações do Modelo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Nome do Modelo
                </label>
                <p className="text-lg font-semibold">{model.name}</p>
              </div>

              {model.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Descrição
                  </label>
                  <p className="text-sm">{model.description}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Total de Itens
                </label>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-sm">
                    {model.items.length}{" "}
                    {model.items.length === 1 ? "item" : "itens"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Criado em
                </label>
                <p className="text-sm">{formatDate(model.created_at)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Última atualização
                </label>
                <p className="text-sm">{formatDate(model.updated_at)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  ID do Modelo
                </label>
                <p className="text-sm font-mono text-muted-foreground">
                  {model.id}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-green-600" />
            Itens do Checklist
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Lista dos itens que serão avaliados quando um checklist for criado
            usando este modelo. Cada item receberá uma avaliação: BOM, REGULAR,
            RUIM ou NÃO SE APLICA.
          </p>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-20 text-center font-semibold">
                      Nº
                    </TableHead>
                    <TableHead className="font-semibold">
                      Item de Avaliação
                    </TableHead>
                    <TableHead className="w-64 text-end font-semibold pr-8">
                      Opções de Avaliação
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {model.items.length > 0 ? (
                    model.items.map((item, index) => (
                      <TableRow
                        key={item.id}
                        className="hover:bg-muted/30 transition-colors border-b border-muted/40"
                      >
                        <TableCell className="text-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                            <span className="text-sm font-semibold text-blue-700">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-8 bg-blue-200 rounded-full"></div>
                            <span className="font-medium text-foreground leading-relaxed">
                              {item.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="w-full pr-8">
                          <div className="flex flex-wrap justify-end gap-2 w-full">
                            <Badge
                              variant="outline"
                              className="text-xs font-medium bg-green-50 border-green-300 text-green-800 hover:bg-green-100 transition-colors px-3 py-1"
                            >
                              ✓ BOM
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-xs font-medium bg-yellow-50 border-yellow-300 text-yellow-800 hover:bg-yellow-100 transition-colors px-3 py-1"
                            >
                              ⚡ REGULAR
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-xs font-medium bg-red-50 border-red-300 text-red-800 hover:bg-red-100 transition-colors px-3 py-1"
                            >
                              ✗ RUIM
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-xs font-medium bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors px-3 py-1"
                            >
                              ○ N/A
                            </Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-12">
                        <div className="flex flex-col items-center gap-4 text-muted-foreground">
                          <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center">
                            <FileText className="h-8 w-8" />
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium">
                              Nenhum item encontrado
                            </p>
                            <p className="text-sm">
                              Este modelo não possui itens de avaliação
                              configurados.
                            </p>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link
                              to="/models/$modelId/edit"
                              params={{ modelId }}
                            >
                              Adicionar Itens
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>

          {model.items.length > 0 && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <CheckSquare className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">
                    Como funciona a avaliação?
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Durante a inspeção, cada item deste modelo receberá uma das
                    quatro classificações:
                  </p>
                  <ul className="text-xs text-muted-foreground mt-2 ml-4 space-y-1">
                    <li>
                      <strong>BOM</strong> - item em excelente condição
                    </li>
                    <li>
                      <strong>REGULAR</strong> - item necessita pequenos ajustes
                    </li>
                    <li>
                      <strong>RUIM</strong> - item em condições inadequadas
                    </li>
                    <li>
                      <strong>NÃO SE APLICA</strong> - item não relevante para
                      este imóvel
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
