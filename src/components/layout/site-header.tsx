import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";
import { Breadcrumbs } from "./breadcrumbs";
import { NotificationBell } from "@/features/notifications";

export function SiteHeader() {
  return (
    <header className="sm:static rounded-t-xl z-10 bg-card sticky top-0 flex h-12 shrink-0 items-center gap-2 border-b">
      <div className="flex w-full items-center gap-2 px-4 lg:gap-3 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-1 h-4 self-center!" />
        <Breadcrumbs />
        <div className="ml-auto flex items-center gap-2">
          <NotificationBell />
          <div className="hidden sm:flex">
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
