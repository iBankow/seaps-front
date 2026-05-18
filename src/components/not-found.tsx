import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";

export const NotFound = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Ops! Página não encontrada.</h1>
      <p className="text-muted-foreground">
        A página que você está procurando não existe ou foi removida.
      </p>
      <Button asChild>
        <Link to="/">Voltar para a página inicial</Link>
      </Button>
    </div>
  );
};
