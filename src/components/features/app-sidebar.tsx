"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Disc3Icon, Library, TrendingUp } from "lucide-react";
import Link from "next/link";
import { NewPlaylistDialog } from "./new-playlist-dialog";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Library",
    url: "/library",
    icon: Library,
  },
  {
    title: "Discovery",
    url: "/",
    icon: Disc3Icon,
  },
  {
    title: "Trending",
    url: "/trending",
    icon: TrendingUp,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={
                  pathname === item.url || pathname === `${item.url}/[slug]`
                }
              >
                <Link href={item.url}>
                  <item.icon />
                  <span className="font-medium">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter className="border-t">
        <NewPlaylistDialog />
      </SidebarFooter>
    </Sidebar>
  );
}
