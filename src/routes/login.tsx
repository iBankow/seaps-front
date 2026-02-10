import { createFileRoute, Link } from "@tanstack/react-router";
import { redirect } from "@tanstack/react-router";
import { z } from "zod";
import { ModeToggle } from "@/components/mode-toggle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { config } from "@/lib/mt-login";
import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-contexts";

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
  const { loginWithMTLogin } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(document.location.search);
    const code = params.get("code");

    if (code) {
      loginWithMTLogin(code);
    }
  }, []);

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={"flex flex-col gap-6"}>
          <Card className="overflow-hidden shadow-lg py-0">
            <CardContent className="grid min-h-[547px] p-0 md:grid-cols-2">
              <div className="self-center p-6 md:p-8">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">
                      Sistema de Manutenção Predial
                    </h1>
                    <p className="text-balance text-muted-foreground">
                      Bem-vindo de volta
                    </p>
                  </div>
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                      <Button
                        type="button"
                        className="h-12 w-full py-1 font-bold uppercase"
                        asChild
                        size={"lg"}
                      >
                        <a href={config.url_login}>
                          Entrar com
                          <img
                            src={"/mt-login.png"}
                            width={40}
                            height={40}
                            alt={"MT Login Logo"}
                          />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative hidden bg-muted md:block">
                <div className="flex h-full items-center justify-center bg-[#1a3180]">
                  <img
                    src={"/logo.png"}
                    width={160}
                    alt="Image"
                    className="inset-0 w-40 object-fill"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
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
