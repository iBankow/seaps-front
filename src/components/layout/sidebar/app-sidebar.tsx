import * as React from "react";

import { NavMain } from "@/components/layout/sidebar/nav-main";
import { NavUser } from "@/components/layout/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useAuth, useCan } from "@/features/auth";
import { Link } from "@tanstack/react-router";
import { NavSecondary } from "./nav-secondary";
import { navMain, navSecondary, type NavItem } from "@/config/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const can = useCan();

  const isVisible = (item: NavItem) =>
    !item.permissions || can(...item.permissions);

  const mainItems = navMain.filter(isVisible);
  const secondaryItems = navSecondary.filter(isVisible);

  return (
    <Sidebar collapsible="icon" variant="sidebar" {...props}>
      <SidebarHeader className="border-b border-sidebar-border pb-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:!px-0 hover:bg-transparent h-full py-1"
              asChild
            >
              <Link to="/">
                <img
                  src={"/logo.png"}
                  alt="logo"
                  className="flex aspect-square size-9 items-center object-cover justify-center rounded-lg"
                />
                <div className="grid flex-1 text-left leading-tight">
                  <span className="font-heading text-2xl leading-none font-extrabold tracking-wide text-white">
                    SIMP
                  </span>
                  <span className="font-mono text-[10px] tracking-widest text-sidebar-foreground/55 uppercase">
                    Sistema de Manutenção Predial
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="pt-2">
        <NavMain items={mainItems} />
        {secondaryItems.length > 0 && (
          <NavSecondary items={secondaryItems} className="mt-auto" />
        )}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border pt-3">
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
