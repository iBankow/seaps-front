import * as React from "react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
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
  // Boxes,
  ChartColumnIncreasing,
  ClipboardList,
  Landmark,
  // Users,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-contexts";
import { Link } from "@tanstack/react-router";
import { NavSecondary } from "./nav-secondary";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: ChartColumnIncreasing,
    },
    {
      title: "Checklists",
      url: "/checklists",
      icon: ClipboardList,
    },
    {
      title: "Imóveis",
      url: "/properties",
      icon: Landmark,
    },
  ],
  navSecondary: [
    {
      title: "Modelos",
      url: "/models",
      // icon: Boxes,
    },
    {
      title: "Usuários",
      url: "/users",
      // icon: Users,
    },
  ],
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

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
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
