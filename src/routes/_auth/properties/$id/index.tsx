import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ChartLine,
  CheckCircle2,
  ClipboardList,
  Edit,
  LoaderCircle,
  Plus,
  UserRound,
} from "lucide-react";

import { BackButton } from "#/components/back-button";
import { Button } from "#/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Skeleton } from "#/components/ui/skeleton";
import { formatDate, formatPhone } from "#/lib/utils";
import api from "#/lib/axios";
import type { Property } from "#/features/properties/types";
import { useLoaderData } from "@tanstack/react-router";
import { PROPERTY_TYPE_META, TypeBadge } from "#/components/type-badge";
import { StatusBadge } from "#/components/status-badge";

type ChecklistStatus = "OPEN" | "CLOSED" | "CANCELED";

type ChecklistListItem = {
  id: string;
  score: number | null;
  status: string;
  created_at: string;
  user?: {
    name?: string;
  };
};

type ChecklistItemScore = {
  score: number | null;
};

type ChecklistSummary = {
  id: string;
  status: ChecklistStatus;
  score: number | null;
  created_at: string;
  user_name: string;
  completion_percentage: number;
  total_items: number;
  good_items: number;
  regular_items: number;
  bad_items: number;
  na_items: number;
};

type PropertyStats = {
  total_checklists: number;
  open_checklists: number;
  closed_checklists: number;
  canceled_checklists: number;
  avg_completion: number;
  avg_score: number;
  recent_checklists: ChecklistSummary[];
};

type PersonDraft = {
  name: string;
  role: string;
  phone: string;
  email: string;
};

const EMPTY_STATS: PropertyStats = {
  avg_score: 0,
  total_checklists: 0,
  open_checklists: 0,
  closed_checklists: 0,
  canceled_checklists: 0,
  avg_completion: 0,
  recent_checklists: [],
};

const getSafeStatus = (status?: string): ChecklistStatus => {
  if (status === "CLOSED" || status === "CANCELED") {
    return status;
  }

  return "OPEN";
};

const normalizeChecklistItems = (payload: unknown): ChecklistItemScore[] => {
  if (Array.isArray(payload)) {
    return payload as ChecklistItemScore[];
  }

  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as { data: unknown }).data)
  ) {
    return (payload as { data: ChecklistItemScore[] }).data;
  }

  return [];
};

const fetchChecklistItems = async (checklistId: string) => {
  try {
    const { data } = await api.get<
      ChecklistItemScore[] | { data: ChecklistItemScore[] }
    >(`/checklists/${checklistId}/items`);

    return normalizeChecklistItems(data);
  } catch {
    return [];
  }
};

const fetchPropertyStats = async (
  propertyName: string,
): Promise<PropertyStats> => {
  try {
    const { data } = await api.get<{ data: ChecklistListItem[] }>(
      "/checklists",
      {
        params: {
          property_name: propertyName,
          limit: 999,
        },
      },
    );

    const allChecklists = data?.data ?? [];
    const sortedByMostRecent = [...allChecklists].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
    const recentBase = sortedByMostRecent.slice(0, 5);

    const open_checklists = allChecklists.filter(
      (item) => getSafeStatus(item.status) === "OPEN",
    ).length;
    const closed_checklists = allChecklists.filter(
      (item) => getSafeStatus(item.status) === "CLOSED",
    ).length;
    const canceled_checklists = allChecklists.filter(
      (item) => getSafeStatus(item.status) === "CANCELED",
    ).length;

    const recent_checklists = await Promise.all(
      recentBase.map(async (checklist) => {
        const items = await fetchChecklistItems(checklist.id);

        const total_items = items.length;
        const answeredItems = items.filter(
          (item) => item.score !== null && item.score !== undefined,
        ).length;
        const completion_percentage =
          total_items > 0 ? (answeredItems / total_items) * 100 : 0;

        return {
          id: checklist.id,
          score: checklist.score,
          status: getSafeStatus(checklist.status),
          created_at: checklist.created_at,
          user_name: checklist.user?.name || "Sem usuário",
          completion_percentage,
          total_items,
          good_items: items.filter((item) => item.score === 3).length,
          regular_items: items.filter((item) => item.score === 1).length,
          bad_items: items.filter((item) => item.score === -2).length,
          na_items: items.filter((item) => item.score === 0).length,
        } satisfies ChecklistSummary;
      }),
    );

    const avg_completion =
      recent_checklists.length > 0
        ? recent_checklists.reduce(
            (acc, checklist) => acc + checklist.completion_percentage,
            0,
          ) / recent_checklists.length
        : 0;

    return {
      total_checklists: allChecklists.length,
      open_checklists,
      closed_checklists,
      canceled_checklists,
      avg_completion,
      avg_score:
        recent_checklists.length > 0
          ? recent_checklists.reduce(
              (acc, checklist) => acc + (checklist.score ?? 0),
              0,
            ) / recent_checklists.length
          : 0,
      recent_checklists,
    };
  } catch (error) {
    console.error("Erro ao buscar estatísticas do imóvel:", error);

    return EMPTY_STATS;
  }
};

const toPersonDraft = (property: Property): PersonDraft => ({
  name: property.person?.name ?? "",
  role: property.person?.role ?? "",
  phone: property.person?.phone ? formatPhone(property.person.phone) : "",
  email: property.person?.email ?? "",
});

export const Route = createFileRoute("/_auth/properties/$id/")({
  component: RouteComponent,
});

function RouteComponent() {
  const data = useLoaderData({ from: "/_auth/properties/$id" });
  const property = data.data as Property;

  const [person, setPerson] = useState(property.person ?? null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isSavingPerson, setIsSavingPerson] = useState(false);
  const [personDraft, setPersonDraft] = useState<PersonDraft>(
    toPersonDraft(property),
  );

  useEffect(() => {
    setPerson(property.person ?? null);
    setPersonDraft(toPersonDraft(property));
  }, [property]);

  useEffect(() => {
    if (editModalOpen) {
      setPersonDraft({
        name: person?.name ?? "",
        role: person?.role ?? "",
        phone: person?.phone ? formatPhone(person.phone) : "",
        email: person?.email ?? "",
      });
    }
  }, [editModalOpen, person]);

  const propertyStatsQuery = useQuery({
    queryKey: ["property-stats", property.id, property.name],
    queryFn: () => fetchPropertyStats(property.name),
    enabled: !!property.name,
  });

  const stats = propertyStatsQuery.data ?? EMPTY_STATS;

  const formattedAddress = useMemo(() => {
    const segments = [
      property.street,
      property.neighborhood,
      property.city,
      property.state,
    ].filter(Boolean);

    return segments.length > 0 ? segments.join(", ") : property.address || "--";
  }, [property]);

  const handleSavePerson = async () => {
    if (!person?.id) return;

    setIsSavingPerson(true);

    try {
      const payload = {
        name: personDraft.name.trim(),
        role: personDraft.role.trim(),
        phone: personDraft.phone.replace(/\D/g, ""),
        email: personDraft.email.trim(),
      };

      const { data } = await api.put(`/persons/${person.id}`, payload);
      const updated = data as {
        name?: string;
        role?: string;
        phone?: string;
        email?: string;
      };

      setPerson((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          name: updated.name ?? payload.name,
          role: updated.role ?? payload.role,
          phone: updated.phone ?? payload.phone,
          email: updated.email ?? payload.email,
        };
      });

      setEditModalOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar responsável:", error);
    } finally {
      setIsSavingPerson(false);
    }
  };

  const propertyTypeMeta =
    PROPERTY_TYPE_META[property.type] ?? PROPERTY_TYPE_META.OWN;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 p-2 sm:gap-6 sm:p-4">
      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <BackButton variant="outline" className="w-fit" />
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {property.name}
                  </h1>
                  <TypeBadge type={property.type} />
                </div>
              </div>
            </div>

            <Button variant="outline" type="button">
              <Edit data-icon="inline-start" />
              Editar Imóvel
            </Button>
          </div>
        </CardContent>
      </Card>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total de Checklists"
          value={stats.total_checklists}
          loading={propertyStatsQuery.isLoading}
          icon={<ClipboardList />}
        />
        <MetricCard
          title="Média de Pontuação"
          value={stats.avg_score.toFixed(3)}
          loading={propertyStatsQuery.isLoading}
          icon={<ChartLine />}
        />
        <MetricCard
          title="Finalizados"
          value={stats.closed_checklists}
          loading={propertyStatsQuery.isLoading}
          icon={<CheckCircle2 />}
        />
        <MetricProgressCard
          title="Progresso Médio"
          value={stats.avg_completion}
          loading={propertyStatsQuery.isLoading}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Imóvel</CardTitle>
            <CardDescription>Dados cadastrais e localização</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <InfoRow label="Nome" value={property.name} />
            <InfoRow label="Tipo" value={propertyTypeMeta.label} />
            <InfoRow
              label="Organização"
              value={property.organization?.name || "--"}
            />
            <InfoRow label="Endereço" value={formattedAddress} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações Adicionais</CardTitle>
            <CardDescription>Responsável e datas de cadastro</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 rounded-lg border p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 font-semibold">
                  <UserRound className="size-4" />
                  Responsável
                </h3>

                <Button
                  variant="secondary"
                  size="sm"
                  type="button"
                  onClick={() => setEditModalOpen(true)}
                >
                  <Edit data-icon="inline-start" />
                  Editar
                </Button>
              </div>

              {person ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoRow label="Nome" value={person.name || "--"} />
                  <InfoRow label="Cargo" value={person.role || "--"} />
                  <InfoRow
                    label="Telefone"
                    value={person.phone ? formatPhone(person.phone) : "--"}
                  />
                  <InfoRow label="E-mail" value={person.email || "--"} />
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Nenhum responsável vinculado a este imóvel.
                </p>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow
                label="Criado em"
                value={formatDate(property.created_at)}
              />
              <InfoRow
                label="Última atualização"
                value={formatDate(property.updated_at)}
              />
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle>Checklists Recentes</CardTitle>
            <CardDescription>
              Últimos checklists vinculados ao imóvel
            </CardDescription>
          </div>

          <Button asChild>
            <Link to="/checklists/create">
              <Plus data-icon="inline-start" />
              Novo Checklist
            </Link>
          </Button>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          {propertyStatsQuery.isLoading && (
            <>
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="rounded-lg border p-4">
                  <Skeleton className="mb-3 h-4 w-44" />
                  <Skeleton className="mb-3 h-4 w-32" />
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
            </>
          )}

          {!propertyStatsQuery.isLoading &&
            stats.recent_checklists.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed px-6 py-12 text-center">
                <p className="text-muted-foreground max-w-md text-sm sm:text-base">
                  Ainda não existem checklists para este imóvel.
                </p>

                <Button asChild>
                  <Link to="/checklists/create">Criar Primeiro Checklist</Link>
                </Button>
              </div>
            )}

          {!propertyStatsQuery.isLoading &&
            stats.recent_checklists.map((checklist) => {
              return (
                <article
                  key={checklist.id}
                  className="rounded-lg border p-4 transition-all duration-200 hover:bg-muted/40"
                >
                  <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">{checklist.user_name}</p>
                      <p className="text-muted-foreground text-sm">
                        {formatDate(checklist.created_at)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusBadge status={checklist.status} />
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          to="/checklists"
                          search={{
                            property_name: property.name,
                          }}
                        >
                          Ver
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className="font-medium">
                        {checklist.completion_percentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-sky-500 to-emerald-500 transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(0, checklist.completion_percentage),
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4 sm:text-sm">
                    <ScoreDot
                      label="BOM"
                      value={checklist.good_items}
                      tone="good"
                    />
                    <ScoreDot
                      label="REGULAR"
                      value={checklist.regular_items}
                      tone="regular"
                    />
                    <ScoreDot
                      label="RUIM"
                      value={checklist.bad_items}
                      tone="bad"
                    />
                    <ScoreDot
                      label="N/A"
                      value={checklist.na_items}
                      tone="na"
                    />
                  </div>
                </article>
              );
            })}
        </CardContent>

        {!propertyStatsQuery.isLoading && stats.total_checklists > 5 && (
          <CardFooter>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link
                to="/checklists"
                search={{
                  property_name: property.name,
                }}
              >
                Ver Todos os Checklists
              </Link>
            </Button>
          </CardFooter>
        )}
      </Card>

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Responsável</DialogTitle>
            <DialogDescription>
              Atualize os dados do responsável vinculado ao imóvel.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <Label htmlFor="person-name">Nome</Label>
            <Input
              id="person-name"
              value={personDraft.name}
              onChange={(event) =>
                setPersonDraft((prev) => ({
                  ...prev,
                  name: event.target.value,
                }))
              }
              disabled={isSavingPerson}
            />

            <Label htmlFor="person-role">Cargo</Label>
            <Input
              id="person-role"
              value={personDraft.role}
              onChange={(event) =>
                setPersonDraft((prev) => ({
                  ...prev,
                  role: event.target.value,
                }))
              }
              disabled={isSavingPerson}
            />

            <Label htmlFor="person-phone">Telefone</Label>
            <Input
              id="person-phone"
              value={personDraft.phone}
              onChange={(event) =>
                setPersonDraft((prev) => ({
                  ...prev,
                  phone: formatPhone(event.target.value),
                }))
              }
              disabled={isSavingPerson}
              inputMode="tel"
            />

            <Label htmlFor="person-email">E-mail</Label>
            <Input
              id="person-email"
              value={personDraft.email}
              onChange={(event) =>
                setPersonDraft((prev) => ({
                  ...prev,
                  email: event.target.value,
                }))
              }
              disabled={isSavingPerson}
              inputMode="email"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditModalOpen(false)}
              disabled={isSavingPerson}
            >
              Cancelar
            </Button>

            <Button
              type="button"
              onClick={handleSavePerson}
              disabled={isSavingPerson || !person?.id}
            >
              {isSavingPerson ? (
                <>
                  <LoaderCircle
                    className="animate-spin"
                    data-icon="inline-start"
                  />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MetricCard({
  title,
  value,
  loading,
  icon,
}: {
  title: string;
  value: number | string;
  loading: boolean;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription className="flex items-center justify-between gap-2">
          {title}
          {icon}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-7 w-16" />
        ) : (
          <p className="text-3xl font-semibold">{value}</p>
        )}
      </CardContent>
    </Card>
  );
}

function MetricProgressCard({
  title,
  value,
  loading,
}: {
  title: string;
  value: number;
  loading: boolean;
}) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-2 w-full" />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-3xl font-semibold">{safeValue.toFixed(0)}%</p>
            <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
              <div
                className="h-full rounded-full bg-linear-to-r from-sky-500 to-emerald-500"
                style={{ width: `${safeValue}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-muted-foreground text-xs uppercase">{label}</p>
      <p className="text-sm font-medium wrap-break-word">{value || "--"}</p>
    </div>
  );
}

function ScoreDot({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "good" | "regular" | "bad" | "na";
}) {
  const dotClassName = {
    good: "bg-emerald-500",
    regular: "bg-amber-500",
    bad: "bg-rose-500",
    na: "bg-zinc-500",
  }[tone];

  return (
    <div className="bg-muted/50 flex items-center gap-2 rounded-md px-2 py-1.5">
      <span className={`inline-block size-2 rounded-full ${dotClassName}`} />
      <span className="text-muted-foreground">{label}</span>
      <span className="ml-auto font-semibold">{value}</span>
    </div>
  );
}
