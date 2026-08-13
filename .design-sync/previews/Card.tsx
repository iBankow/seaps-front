import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
  Button,
  Badge,
} from "seaps-front";

export function Default() {
  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Detran/MT — 0200/26</CardTitle>
        <CardDescription>Av. Historiador Rubens de Mendonça, 1731</CardDescription>
        <CardAction>
          <Badge>Aberto</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Checklist criado em 12/08/2026, com 18 itens vistoriados de 24.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Ver checklist
        </Button>
      </CardFooter>
    </Card>
  );
}

export function Compact() {
  return (
    <Card size="sm" className="w-72">
      <CardHeader>
        <CardTitle>Resumo</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          3 imóveis pendentes de vistoria nesta semana.
        </p>
      </CardContent>
    </Card>
  );
}
