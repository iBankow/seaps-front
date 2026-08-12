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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:!px-0 !py-3 h-full"
              asChild
            >
              <Link to="/">
                <img
                  src={"/logo.png"}
                  alt="logo"
                  className="flex aspect-square size-10 items-center object-contain justify-center rounded-lg"
                />
                <div className="grid flex-1 text-left text-lg leading-tight">
                  <span className="text-nowrap font-semibold">SEAPS</span>
                  <span className="text-sm text-nowrap">
                    Sistema de Manutenção Predial
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={mainItems} />
        {secondaryItems.length > 0 && (
          <NavSecondary items={secondaryItems} className="mt-auto" />
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
