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
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Disc3Icon, Library, TrendingUp } from "lucide-react";
import Link from "next/link";
import { NewPlaylistDialog } from "./new-playlist-dialog";
import { usePathname } from "next/navigation";
import Logo from "../ui/logo";
import { Separator } from "../ui/separator";
import { TFullPlaylist } from "@/types";
import { CoverImage } from "../ui/cover-image";
import { ItemTitle } from "../ui/item-title";
import Dot from "../ui/dot";
import { FallbackCoverImage } from "./fallback-cover-image";

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

type AppSidebarProps = {
  playlists: Pick<TFullPlaylist, "title" | "id" | "imageId" | "user">[];
};

export function AppSidebar({ playlists }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  size="md"
                  asChild
                  isActive={
                    pathname === item.url || pathname === `${item.url}/[id]`
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
        </SidebarGroup>
        <Separator />
        <SidebarGroup>
          <SidebarMenu>
            {playlists.map((playlist) => (
              <SidebarMenuItem key={playlist.id}>
                <SidebarMenuButton
                  size="lg"
                  asChild
                  isActive={pathname === `/playlists/${playlist.id}`}
                >
                  <Link href={`/playlists/${playlist.id}`}>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {playlist.imageId ? (
                        <CoverImage
                          src={playlist.imageId}
                          alt={playlist.title}
                          size="xs"
                        />
                      ) : (
                        <FallbackCoverImage type="item" />
                      )}
                      <div className="flex flex-col gap-0.5 w-full overflow-hidden">
                        <p className="text-foreground font-medium text-[calc(13rem/16)] truncate">
                          {playlist.title}
                        </p>
                        <div className="flex items-center text-[calc(11rem/16)] gap-x-1 text-muted-foreground truncate">
                          <p>Playlist</p>
                          <Dot />
                          <span>{playlist.user?.name}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <NewPlaylistDialog />
      </SidebarFooter>
    </Sidebar>
  );
}
