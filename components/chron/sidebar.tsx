import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@chron/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { LayoutDashboard, Settings } from "lucide-react";

export default function ChronSidebar() {
  const items = [
    {
      title: "Home",
      icon: LayoutDashboard,
      url: "/",
    },
    {
      title: "Settings",
      icon: Settings,
      url: "/settings",
    },
  ] as const;

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link to={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="text-xs text-gray-500">
        <a href="https://github.com/ElijahKSmith/chron" target="_blank">
          ⭐ chron on GitHub!
        </a>
      </SidebarFooter>
    </Sidebar>
  );
}
