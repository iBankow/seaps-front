import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  Badge,
} from "seaps-front";

export function Default() {
  return (
    <Table>
      <TableCaption>Checklists recentes</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Código</TableHead>
          <TableHead>Órgão</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>0200/26</TableCell>
          <TableCell>DETRAN</TableCell>
          <TableCell>
            <Badge>Aberto</Badge>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>0198/26</TableCell>
          <TableCell>SEPLAG</TableCell>
          <TableCell>
            <Badge variant="secondary">Fechado</Badge>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
