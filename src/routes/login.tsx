import { createFileRoute, Link } from "@tanstack/react-router";
import { redirect } from "@tanstack/react-router";
import { z } from "zod";
import { LoginForm } from "@/components/login-form";
import { ModeToggle } from "@/components/mode-toggle";

const fallback = "/" as const;

export const Route = createFileRoute("/login")({
  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || fallback });
    }
  },
  component: LoginComponent,
});

function LoginComponent() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
      <div className="mt-4 inline-flex items-center gap-4">
        <Link to="/privacy-policy" className="text-sky-600 hover:underline">
          Politica de Privacidade
        </Link>
        <p className="text-sm">Versão: 1.0.0</p>
      </div>
      <div className="absolute bottom-4 right-4">
        <ModeToggle />
      </div>
    </div>
  );
}
