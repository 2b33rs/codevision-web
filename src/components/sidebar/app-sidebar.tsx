import * as React from "react";
import { NavMain } from "@/components/sidebar/nav-main.tsx";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar.tsx";
import { NAV_ABTEILUNGEN, NAV_MAIN } from "@/navigation/sidebarItems.tsx";
import { Shirt } from "lucide-react";
import { Link } from "react-router";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" variant={"inset"} {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to={"/"}>
                <Shirt className="!size-5" />
                <span className="text-base font-semibold">YourShirt GmbH</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={NAV_MAIN} />
      </SidebarContent>
      {state == "expanded" && <SidebarSeparator />}
      <SidebarFooter>
        <NavMain items={NAV_ABTEILUNGEN} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
