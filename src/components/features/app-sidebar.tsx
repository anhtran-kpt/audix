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
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { Disc3Icon, Library, TrendingUp } from "lucide-react";
import Link from "next/link";
import { NewPlaylistDialog } from "./new-playlist-dialog";
import { usePathname } from "next/navigation";
import Logo from "../ui/logo";
import { Separator } from "../ui/separator";
import { CoverImage } from "../ui/cover-image";
import Dot from "../ui/dot";
import { FallbackCoverImage } from "./fallback-cover-image";
import { ArtistImage } from "../ui/artist-image";
import { ScrollArea } from "../ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { sidebarPlaylistOptions } from "@/react-query/query-options/playlist";
import { sidebarArtistOptions } from "@/react-query/query-options/artist";
import { NavLink } from "../ui/nav-link";

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

  const { data: playlists, status: playlistStatus } = useQuery(
    sidebarPlaylistOptions()
  );

  const { data: artists, status: artistStatus } = useQuery(
    sidebarArtistOptions()
  );

  return (
    <Sidebar collapsible="icon" variant="inset">
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
        <ScrollArea className="h-full min-h-0" scrollBarClassName="w-2">
          <SidebarGroup className="h-full">
            <SidebarMenu>
              {artistStatus === "pending"
                ? Array.from({ length: 5 }).map((_, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuSkeleton />
                    </SidebarMenuItem>
                  ))
                : artists?.map((artist) => (
                    <SidebarMenuItem key={artist.id}>
                      <SidebarMenuButton
                        size="lg"
                        asChild
                        isActive={pathname === `/artists/${artist.id}`}
                      >
                        <Link href={`/artists/${artist.id}`}>
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <ArtistImage
                              src={artist.imageId}
                              alt={artist.name}
                              size="sm"
                            />
                            <div className="flex flex-col gap-0.5 w-full overflow-hidden">
                              <p className="text-foreground font-medium text-[calc(13rem/16)] truncate">
                                {artist.name}
                              </p>
                              <p className="text-[calc(11rem/16)] text-muted-foreground truncate font-normal">
                                Artist
                              </p>
                            </div>
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              {playlistStatus === "pending"
                ? Array.from({ length: 5 }).map((_, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuSkeleton />
                    </SidebarMenuItem>
                  ))
                : playlists?.map((playlist) => (
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
                                {playlist.user && (
                                  <NavLink
                                    href={`/users/${playlist.user.id}`}
                                    className="text-[calc(11rem/16)]"
                                  >
                                    {playlist.user.name}
                                  </NavLink>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
            </SidebarMenu>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="border-t px-4 py-2">
        <NewPlaylistDialog />
      </SidebarFooter>
    </Sidebar>
  );
}
