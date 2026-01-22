import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sheet, Download, Eye, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { api } from "@/lib/api";
import { useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import { getFirstAndLastName } from "@/lib/utils";

interface ExportModalProps {
  data: any[];
  totalRecords?: number;
}

const AVAILABLE_COLUMNS = [
  { id: "sid", label: "ID", essential: true },
  { id: "organization", label: "Orgão", essential: true },
  { id: "property", label: "Imóvel", essential: true },
  { id: "city", label: "Cidade", essential: false },
  { id: "status", label: "Status", essential: false },
  { id: "score", label: "Pontuação", essential: false },
  { id: "classification", label: "Classificação", essential: false },
  { id: "is_returned", label: "Retorno", essential: false },
  { id: "user", label: "Responsável", essential: false },
  { id: "finished_at", label: "Finalizado em", essential: false },
  { id: "created_at", label: "Criado em", essential: false },
];

export function ExportModal({ data, totalRecords }: ExportModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    AVAILABLE_COLUMNS.filter((col) => col.essential).map((col) => col.id)
  );
  const [useFilters, setUseFilters] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const search = useSearch({ from: "/_auth/checklists/" });

  // Dados de prévia limitados às primeiras 5 linhas
  const previewData = useMemo(() => {
    return data || [];
  }, [data]);

  const handleColumnToggle = (columnId: string) => {
    const column = AVAILABLE_COLUMNS.find((col) => col.id === columnId);

    // Não permite desmarcar colunas essenciais
    if (column?.essential && selectedColumns.includes(columnId)) {
      return;
    }

    setSelectedColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    );
  };

  const handleSelectAll = () => {
    if (selectedColumns.length === AVAILABLE_COLUMNS.length) {
      // Manter apenas as essenciais
      setSelectedColumns(
        AVAILABLE_COLUMNS.filter((col) => col.essential).map((col) => col.id)
      );
    } else {
      // Selecionar todas
      setSelectedColumns(AVAILABLE_COLUMNS.map((col) => col.id));
    }
  };

  const getPreviewValue = (item: any, columnId: string) => {
    switch (columnId) {
      case "sid":
        return item.sid;
      case "organization":
        return item.organization?.name || "--";
      case "property":
        return item.property?.name || "--";
      case "city":
        return item.property?.city || "--";
      case "status":
        const statusLabels = {
          OPEN: "ABERTO",
          CLOSED: "FECHADO",
          APPROVED: "APROVADO",
          REJECTED: "REJEITADO",
        };
        return (
          statusLabels[item.status as keyof typeof statusLabels] ||
          item.status ||
          "--"
        );
      case "score":
        return item.score !== null ? Number(item.score).toFixed(2) : "--";
      case "classification":
        const classificationLabels = { 0: "RUIM", 1: "REGULAR", 2: "BOM" };
        return item.classification !== null
          ? classificationLabels[
              item.classification as keyof typeof classificationLabels
            ]
          : "--";
      case "is_returned":
        return item.is_returned ? `${item.return}º Retorno` : "Não";
      case "user":
        return item.user?.name ? getFirstAndLastName(item.user.name) : "--";
      case "finished_at":
        return item.finished_at
          ? new Date(item.finished_at).toLocaleDateString("pt-BR")
          : "--";
      case "created_at":
        return item.created_at
          ? new Date(item.created_at).toLocaleDateString("pt-BR")
          : "--";
      default:
        return "--";
    }
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const exportParams = {
        columns: selectedColumns,
        use_filters: useFilters,
        ...(useFilters ? { ...search, per_page: null, page: null } : {}),
      };

      const response = await api.get("/api/v1/checklists/export", {
        params: exportParams,
        responseType: "blob",
      });

      // Criar link de download
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Nome do arquivo com timestamp
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/[:.]/g, "-");
      link.download = `checklists-export-${timestamp}.xlsx`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Exportação concluída com sucesso!");
      setIsOpen(false);
    } catch (error) {
      console.error("Erro na exportação:", error);
      toast.error("Erro ao exportar dados. Tente novamente.");
    } finally {
      setIsExporting(false);
    }
  };

  const selectedColumnsData = AVAILABLE_COLUMNS.filter((col) =>
    selectedColumns.includes(col.id)
  );

  const recordsToExport = useFilters
    ? totalRecords || data?.length || 0
    : totalRecords || 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Sheet className="h-4 w-4" />
          Exportar Dados
        </Button>
      </DialogTrigger>

      <DialogContent className="!max-w-[90%] overflow-y-auto h-5/6 flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sheet className="h-5 w-5" />
            Exportar Checklists para Excel
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Painel de configuração */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Configurações</h3>
                  <Badge variant="outline">
                    {recordsToExport} registro{recordsToExport !== 1 ? "s" : ""}
                  </Badge>
                </div>

                {/* Opção de usar filtros */}
                <div className="flex items-center space-x-3 p-4 border rounded-lg">
                  <Switch
                    id="use-filters"
                    checked={useFilters}
                    onCheckedChange={setUseFilters}
                  />
                  <div className="space-y-1">
                    <Label
                      htmlFor="use-filters"
                      className="text-sm font-medium"
                    >
                      Usar filtros ativos
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {useFilters
                        ? "Exportar apenas dados que atendem aos filtros aplicados"
                        : "Exportar todos os dados sem filtros"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Seleção de colunas */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Colunas para Exportar</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                    className="text-xs"
                  >
                    {selectedColumns.length === AVAILABLE_COLUMNS.length ? (
                      <>
                        <X className="h-3 w-3 mr-1" />
                        Limpar
                      </>
                    ) : (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Selecionar Todas
                      </>
                    )}
                  </Button>
                </div>

                <ScrollArea className="border rounded-md p-4">
                  <div className="space-y-3">
                    {AVAILABLE_COLUMNS.map((column) => (
                      <div
                        key={column.id}
                        className="flex items-center space-x-3"
                      >
                        <Checkbox
                          id={column.id}
                          checked={selectedColumns.includes(column.id)}
                          onCheckedChange={() => handleColumnToggle(column.id)}
                          disabled={column.essential}
                        />
                        <Label
                          htmlFor={column.id}
                          className={`text-sm ${column.essential ? "font-medium" : ""}`}
                        >
                          {column.label}
                          {column.essential && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              Essencial
                            </Badge>
                          )}
                        </Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <p className="text-xs text-muted-foreground">
                  {selectedColumns.length} de {AVAILABLE_COLUMNS.length} colunas
                  selecionadas
                </p>
              </div>
            </div>

            {/* Prévia dos dados */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                <h3 className="text-lg font-medium">Prévia dos Dados</h3>
                <Badge variant="secondary">
                  Mostrando {previewData.length} do{" "}
                  total
                </Badge>
              </div>

              <div className="border rounded-md">
                <ScrollArea className="h-96">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {selectedColumnsData.map((column) => (
                          <TableHead
                            key={column.id}
                            className="whitespace-nowrap"
                          >
                            {column.label}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.length > 0 ? (
                        previewData.map((item, index) => (
                          <TableRow key={index}>
                            {selectedColumnsData.map((column) => (
                              <TableCell
                                key={column.id}
                                className="max-w-40 truncate"
                              >
                                {getPreviewValue(item, column.id)}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={selectedColumnsData.length}
                            className="text-center text-muted-foreground"
                          >
                            Nenhum dado disponível para prévia
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isExporting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleExport}
            disabled={selectedColumns.length === 0 || isExporting}
            className="gap-2"
          >
            {isExporting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Exportando...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Exportar Excel
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
