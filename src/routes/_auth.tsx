import { Breadcrumbs } from "@/components/breadcrumbs";
import { ModeToggle } from "@/components/mode-toggle";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import {
  SIDEBAR_COOKIE_NAME,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Outlet, redirect } from "@tanstack/react-router";
import { ClipboardList, Home, Landmark } from "lucide-react";

export const Route = createFileRoute("/_auth")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }

    if (!context.auth.user?.is_active) {
      throw redirect({
        to: "/request",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  const defaultOpen = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${SIDEBAR_COOKIE_NAME}=`))
    ?.split("=")[1];

  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="min-h-screen w-full flex flex-col h-full">
        <header className="py-2 sm:static rounded-t-xl z-10 bg-background sticky top-0 flex h-(--header-height) shrink-0 items-center gap-2 border-b">
          <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <Breadcrumbs />
            <div className="flex ml-auto items-center gap-2">
              <ModeToggle />
            </div>
          </div>
        </header>
        <div className="flex-1">
          <Outlet />
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      defaultOpen={defaultOpen === "true"}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2 p-2">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export function BottomNav() {
  const tabs = [
    { id: "home" as const, label: "Início", icon: Home },
    { id: "checklists" as const, label: "Checklists", icon: ClipboardList },
    { id: "properties" as const, label: "Imóveis", icon: Landmark },
  ];

  return (
    <nav className="sticky bottom-0 left-0 right-0 bg-accent border-t border-border pb-safe">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <Button
              key={tab.id}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-4 py-2 min-w-[60px] transition-colors",
              )}
              variant="ghost"
              asChild
              type="button"
            >
              <Link
                to={tab.id === "home" ? "/" : `/${tab.id}`}
                className="text-muted-foreground data-[status='active']:font-bold data-[status='active']:text-foreground"
              >
                <Icon className={cn("size-5")} />
                <span>{tab.label}</span>
              </Link>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
