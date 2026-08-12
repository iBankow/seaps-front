import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";
import { Breadcrumbs } from "./breadcrumbs";
import { NotificationBell } from "@/features/notifications";

export function SiteHeader() {
  return (
    <header className="sm:static rounded-t-xl z-10 bg-background sticky top-0 flex h-(--header-height) shrink-0 items-center gap-2 border-b">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 h-4 self-center!" />
        <Breadcrumbs />
        <div className="hidden sm:flex ml-auto items-center gap-2">
          <NotificationBell />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
