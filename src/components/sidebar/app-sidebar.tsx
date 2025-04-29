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
} from "@/components/ui/sidebar.tsx";
import { NAV_MAIN } from "@/navigation/sidebarItems.tsx";
import { Shirt } from "lucide-react";
import { NavUser } from "@/components/sidebar/nav-user.tsx";
import { Link } from "react-router";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        {/*<NavDocuments items={data.documents} />*/}
        {/*<NavSecondary items={data.navSecondary} className="mt-auto" />*/}
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: "John Doe",
            email: "hi@test.de",
            avatar: "Avatar",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
