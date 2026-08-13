import { DataTable } from "seaps-front";
import type { ColumnDef } from "@tanstack/react-table";

type Checklist = { codigo: string; orgao: string; status: string };

const columns: ColumnDef<Checklist>[] = [
  { accessorKey: "codigo", header: "Código" },
  { accessorKey: "orgao", header: "Órgão" },
  { accessorKey: "status", header: "Status" },
];

const data: Checklist[] = [
  { codigo: "0200/26", orgao: "DETRAN", status: "Aberto" },
  { codigo: "0198/26", orgao: "SEPLAG", status: "Fechado" },
  { codigo: "0187/26", orgao: "SEAD", status: "Aberto" },
];

export function Default() {
  return (
    <div className="w-[420px]">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
