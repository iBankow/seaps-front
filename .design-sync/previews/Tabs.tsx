import { Tabs, TabsList, TabsTrigger, TabsContent } from "seaps-front";

export function Default() {
  return (
    <Tabs defaultValue="detalhes" className="w-80">
      <TabsList>
        <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
        <TabsTrigger value="itens">Itens</TabsTrigger>
        <TabsTrigger value="imagens">Imagens</TabsTrigger>
      </TabsList>
      <TabsContent value="detalhes">
        <p className="text-sm text-muted-foreground">
          Checklist criado em 12/08/2026, órgão DETRAN/MT.
        </p>
      </TabsContent>
    </Tabs>
  );
}
