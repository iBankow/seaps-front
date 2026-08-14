import { Link } from "@tanstack/react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge, useChecklistsList } from "@/features/checklists";

export function ChecklistsCard() {
  const { data, isLoading } = useChecklistsList({ page: 1, per_page: 5 });

  const checklists = data?.data ?? [];

  if (isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Carregando…</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Código</TableHead>
          <TableHead>Órgão</TableHead>
          <TableHead>Imóvel</TableHead>
          <TableHead>Avaliador</TableHead>
          <TableHead className="text-right">Situação</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {checklists.map((checklist) => (
          <TableRow key={checklist.id} className="hover:bg-secondary/60">
            <TableCell className="font-mono text-xs text-muted-foreground">
              <Link
                to="/checklists/$checklistId/items"
                params={{ checklistId: checklist.id }}
                className="hover:text-primary"
                preload={false}
              >
                {checklist.sid}
              </Link>
            </TableCell>
            <TableCell className="font-heading text-xs font-semibold tracking-wide">
              {checklist.organization?.acronym}
            </TableCell>
            <TableCell className="font-heading max-w-56 truncate text-sm font-semibold tracking-wide uppercase">
              {checklist.property.name}
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {checklist.user?.name}
            </TableCell>
            <TableCell className="text-right">
              <StatusBadge status={checklist.status} />
            </TableCell>
          </TableRow>
        ))}
        {checklists.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
              Nenhum checklist encontrado.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
