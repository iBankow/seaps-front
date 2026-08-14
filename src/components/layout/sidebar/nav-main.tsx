import type React from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "@tanstack/react-router";
import type { LucideProps } from "lucide-react";

interface MenuItem {
  title: string;
  url: string;
  icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}

export function NavMain({ items }: { items: MenuItem[] }) {
  const { pathname } = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-1">
        <SidebarMenu>
          {items.map((item) => {
            const isActive =
              item.url === "/"
                ? pathname === "/"
                : pathname.startsWith(item.url);

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={isActive}
                  className="font-heading gap-2.5 px-2.5 text-xs font-normal tracking-wide uppercase data-active:text-white data-active:font-black text-muted/80" 
                  asChild
                >
                  <Link to={item.url} className="w-full">
                    <span
                      aria-hidden
                      className="h-4 w-1 shrink-0 rounded-full bg-sidebar-primary data-[inactive=true]:bg-transparent group-data-[collapsible=icon]:hidden"
                      data-inactive={!isActive}
                    />
                    {item.icon && <item.icon className="shrink-0" />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
