import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./mode-toggle";
import { Breadcrumbs, useCrumbs } from "./breadcrumbs";
import {
  usePageHeaderContext,
  type HeaderTone,
} from "./page-header-context";
import { NotificationBell } from "@/features/notifications";

const RULE_TONE: Record<HeaderTone, string> = {
  brand: "border-b-primary",
  success: "border-b-success",
  destructive: "border-b-destructive",
  validated: "border-b-validated",
  muted: "border-b-muted-foreground",
};

/**
 * The application's only header — the 66px bar from the "Painel SIMP" design:
 * eyebrow + page title on the left, page actions and utilities on the right,
 * over a 3px brand rule.
 *
 * Title and actions come from whichever page rendered a <PageHeader>; pages
 * that don't render one fall back to the route breadcrumbs.
 */
export function SiteHeader() {
  const { heading, setActionsSlot } = usePageHeaderContext();
  const crumbs = useCrumbs();

  const title = heading?.title ?? crumbs.at(-1)?.label ?? "";

  return (
    <header
      className={cn(
        "sticky top-0 z-10 flex h-[66px] shrink-0 items-center gap-3 border-b-[3px] bg-card px-4 lg:gap-5 lg:px-[30px]",
        RULE_TONE[heading?.tone ?? "brand"],
      )}
    >
      <SidebarTrigger className="-ml-1 shrink-0" />

      <div className="min-w-0">
        {heading?.eyebrow ? (
          <div className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
            {heading.eyebrow}
          </div>
        ) : (
          <Breadcrumbs omitLast />
        )}
        <h1 className="font-heading truncate text-[17px] leading-tight font-bold tracking-[0.03em] uppercase">
          {title}
        </h1>
      </div>

      <div
        ref={setActionsSlot}
        className="ml-auto flex min-w-0 flex-wrap items-center justify-end gap-3"
      />

      <div className="flex shrink-0 items-center gap-2">
        <NotificationBell />
        <div className="hidden sm:flex">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
