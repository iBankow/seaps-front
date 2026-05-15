import * as React from "react";

import { NavMain } from "#/components/sidebar/nav-main";
import { NavSecondary } from "#/components/sidebar/nav-secondary";
import { NavUser } from "#/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Boxes,
  ChartColumnIncreasing,
  ClipboardList,
  Landmark,
  Users,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: <ChartColumnIncreasing />,
    },
    {
      title: "Checklists",
      url: "/checklists",
      icon: <ClipboardList />,
    },
    {
      title: "Imóveis",
      url: "/properties",
      icon: <Landmark />,
    },
  ],
  navSecondary: [
    {
      title: "Modelos",
      url: "/models",
      icon: <Boxes />,
    },
    {
      title: "Usuários",
      url: "/users",
      icon: <Users />,
    },
  ],
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground">
                  <img src={"/logo.png"} alt="logo" className="rounded-lg" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">SEAPS</span>
                  <span className="truncate text-xs">
                    Sistema de Manutenção Predial
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
