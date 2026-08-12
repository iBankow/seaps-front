import { Link } from "@tanstack/react-router";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChecklistActions as Actions,
  ClassificationBadge,
  StatusBadge,
  useChecklistsList,
} from "@/features/checklists";

export function ChecklistsCard() {
  const { data, isLoading } = useChecklistsList({
    page: 1,
    per_page: 5,
    status: "CLOSED",
  });

  const checklists = data?.data ?? [];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Orgão</TableHead>
            <TableHead>Imóvel</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Classificação</TableHead>
            <TableHead>Pontuação</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {checklists.map((checklist) => (
            <TableRow key={checklist.id}>
              <TableCell className="font-medium text-left">
                <Link
                  to="/checklists/$checklistId/items"
                  params={{ checklistId: checklist.id }}
                  className="font-mono text-sky-400 hover:text-sky-700"
                  preload={false}
                >
                  {checklist.sid}
                </Link>
              </TableCell>
              <TableCell className="text-left">
                {checklist.organization?.acronym}
              </TableCell>
              <TableCell className="text-left truncate w-[100px]">
                {checklist.property.name}
              </TableCell>
              <TableCell className="text-left">
                <StatusBadge status={checklist.status} />
              </TableCell>
              <TableCell className="text-left">
                <ClassificationBadge
                  classification={checklist.classification}
                />
              </TableCell>
              <TableCell className="text-left">
                {checklist.score ? Number(checklist.score).toFixed(2) : "--"}
              </TableCell>
              <TableCell className="text-right">
                <Actions row={{ original: checklist } as any} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableCaption>
          <Link to="/checklists" className="underline text-sky-400">
            Visualizar todos os checklists
          </Link>
        </TableCaption>
      </Table>
    </div>
  );
}
