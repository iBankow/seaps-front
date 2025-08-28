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
  Brain,
  Camera,
  ChartColumnIncreasing,
  ClipboardList,
  ClipboardMinus,
  Database,
  File,
  HelpCircle,
  Landmark,
  Search,
  Settings,
  Users,
  WholeWord,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-contexts";
import { Link } from "@tanstack/react-router";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: ChartColumnIncreasing,
      role: ["EVALUATOR", "SUPERVISOR", "ADMIN"],
    },
    {
      title: "Checklists",
      url: "/checklists",
      icon: ClipboardList,
      role: ["EVALUATOR", "SUPERVISOR", "ADMIN"],
    },
    {
      title: "Imóveis",
      url: "/properties",
      icon: Landmark,
      role: ["SUPERVISOR", "ADMIN"],
    },
    // {
    //   title: "Orgãos",
    //   url: "/organizations",
    //   icon: Building2,
    //   role: ["SUPERVISOR", "ADMIN"],
    // },
    // {
    //   title: "Modelos",
    //   url: "/models",
    //   icon: Boxes,
    //   role: ["ADMIN"],
    // },
    {
      title: "Usuários",
      url: "/users",
      icon: Users,
      role: ["ADMIN"],
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: Camera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: File,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: Brain,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircle,
    },
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: Database,
    },
    {
      name: "Reports",
      url: "#",
      icon: ClipboardMinus,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: WholeWord,
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
                  <span className="text-sm text-nowrap">Sistema de Manutenção Predial</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
