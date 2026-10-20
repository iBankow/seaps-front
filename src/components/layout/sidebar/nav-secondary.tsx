import * as React from "react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../ui/collapsible";
import { ChevronRight, Settings } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function NavSecondary({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: React.ElementType;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Sistema</SidebarGroupLabel>
      <SidebarMenu>
        <Collapsible className="group/collapsible" render={<SidebarMenuItem />}>
          <CollapsibleTrigger
            render={
              <SidebarMenuButton
                tooltip="Configurações"
                className="font-heading gap-2.5 px-2.5 text-xs font-semibold tracking-wide uppercase"
              />
            }
          >
            <Settings className="shrink-0" />
            <span>Configurações</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[open]/collapsible:rotate-90" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {items?.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    render={
                      <Link
                        to={subItem.url}
                        className="w-full hover:underline data-[status='active']:font-bold"
                      />
                    }
                  >
                    {subItem.icon && <subItem.icon />}
                    <span>{subItem.title}</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}
