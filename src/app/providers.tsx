import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@/lib/query-client";
import { AuthProvider } from "@/features/auth";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

/**
 * Todos os providers da aplicação. Não conhece o router — quem faz a ponte
 * entre o AuthProvider e o context do router é o `app/app.tsx`.
 *
 * A ordem do aninhamento e a posição do <Toaster /> importam: o Toaster lê o
 * tema via next-themes, então precisa ficar dentro do ThemeProvider.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>{children}</AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
      <Toaster richColors />
    </ThemeProvider>
  );
}
