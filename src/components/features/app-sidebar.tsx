"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { NewPlaylistDialog } from "./new-playlist-dialog";
import { usePathname } from "next/navigation";
import Dot from "../ui/dot";
import { FallbackCoverImage } from "./fallback-cover-image";
import { ScrollArea } from "../ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { SidebarArtist } from "@/features/artist/contracts/artist-dto";
import { SidebarPlaylist } from "@/features/playlist/contracts/playlist-dto";
import { sidebarPlaylistOptions } from "@/features/playlist/query/playlist-options";
import { sidebarArtistOptions } from "@/features/artist/query/artist-options";
import WaveForm from "../ui/wave-form";
import { IconButton } from "../ui/icon-button";
import {
  PlusIcon,
  PanelLeftCloseIcon,
  PanelRightCloseIcon,
  PlayIcon,
} from "lucide-react";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import CoverImage from "../shared/cover-image";
import { SidebarItemWrapper } from "../shared/sidebar-item-wrapper";
import { usePlaybackStore } from "@/stores/use-playback-store";

export function AppSidebar({
  initialArtists,
  initialPlaylists,
}: {
  initialArtists: SidebarArtist[];
  initialPlaylists: SidebarPlaylist[];
}) {
  const pathname = usePathname();
  const { toggleSidebar, open } = useSidebar();

  const { data: playlists } = useQuery({
    ...sidebarPlaylistOptions(),
    initialData: initialPlaylists,
    initialDataUpdatedAt: Date.now(),
  });

  const { data: artists } = useQuery({
    ...sidebarArtistOptions(),
    initialData: initialArtists,
    initialDataUpdatedAt: Date.now(),
  });

  const session = usePlaybackStore((s) => s.session);

  const [filter, setFilter] = useState<"all" | "artists" | "playlists">("all");

  return (
    <Sidebar collapsible="icon" variant="inset" className="group">
      <SidebarHeader className="space-y-3 p-3">
        {open ? (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center [--icon-w:1.25rem]">
                <div className="w-0 overflow-hidden transition-[width] duration-300 group-hover:w-[var(--icon-w)] flex items-center">
                  <IconButton
                    icon={PanelLeftCloseIcon}
                    className="w-[var(--icon-w)] h-[var(--icon-w)] -translate-x-2 group-hover:translate-x-0 transition-transform duration-300"
                    aria-label="Close panel"
                    tooltipContent="Collapse your library"
                    onClick={toggleSidebar}
                  />
                </div>

                <span className="truncate duration-300 group-hover:ml-2 font-semibold">
                  Your Library
                </span>
              </div>
              <NewPlaylistDialog
                trigger={
                  <IconButton
                    icon={PlusIcon}
                    aria-label="New playlist"
                    tooltipContent="New playlist"
                    iconClassName="size-6"
                  />
                }
              />
            </div>
            <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
              <TabsList className="w-full bg-sidebar p-0">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="playlists">Playlists</TabsTrigger>
                <TabsTrigger value="artists">Artists</TabsTrigger>
              </TabsList>
            </Tabs>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center">
              <IconButton
                icon={PanelRightCloseIcon}
                aria-label="Expand panel"
                tooltipContent="Expand your library"
                iconClassName="size-6"
                onClick={toggleSidebar}
              />
            </div>
            <div className="flex items-center justify-center">
              <NewPlaylistDialog
                trigger={
                  <IconButton
                    icon={PlusIcon}
                    aria-label="New playlist"
                    tooltipContent="New playlist"
                    iconClassName="size-6"
                  />
                }
              />
            </div>
          </>
        )}
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="h-full min-h-0" scrollBarClassName="w-2">
          <SidebarGroup className="h-full">
            <SidebarMenu>
              {(filter === "all" || filter === "artists") &&
                artists.map((artist) => (
                  <SidebarMenuItem key={artist.id}>
                    <SidebarMenuButton
                      size="lg"
                      asChild
                      isActive={pathname === `/artists/${artist.id}`}
                    >
                      <Link href={`/artists/${artist.id}`}>
                        <SidebarItemWrapper
                          open={open}
                          image={
                            <>
                              <CoverImage
                                fill
                                sizes="36px"
                                className="rounded-full group-hover/menu-item:brightness-65"
                                alt={artist.name}
                                src={artist.imageId}
                                priority
                              />
                              <IconButton
                                icon={PlayIcon}
                                size="sm"
                                onClick={
                                  () => {}
                                  // handleContextPlay({
                                  //   contextId: artist.id,
                                  //   name: artist.name,
                                  //   type: "ARTIST",
                                  // })
                                }
                                iconClassName="fill-foreground stroke-0"
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 invisible group-hover/menu-item:visible"
                              />
                            </>
                          }
                          info={
                            <>
                              <p className="text-foreground font-medium text-13 truncate">
                                {artist.name}
                              </p>
                              <p className="text-11 text-muted-foreground truncate font-normal">
                                Artist
                              </p>
                            </>
                          }
                          right={
                            session?.isPlaying &&
                            session?.snapshot?.contextId === artist.id && (
                              <WaveForm />
                            )
                          }
                        />
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

              {(filter === "all" || filter === "playlists") &&
                playlists.map((playlist) => (
                  <SidebarMenuItem key={playlist.id}>
                    <SidebarMenuButton
                      size="lg"
                      asChild
                      isActive={pathname === `/playlists/${playlist.id}`}
                    >
                      <Link href={`/playlists/${playlist.id}`}>
                        <SidebarItemWrapper
                          open={open}
                          image={
                            playlist.imageId ? (
                              <>
                                <CoverImage
                                  fill
                                  sizes="36px"
                                  className="rounded-sm group-hover/menu-item:brightness-65"
                                  alt={playlist.title}
                                  src={playlist.imageId}
                                  priority
                                />
                                <IconButton
                                  icon={PlayIcon}
                                  size="sm"
                                  onClick={
                                    () => {}
                                    // handleContextPlay({
                                    //   contextId: playlist.id,
                                    //   name: playlist.title,
                                    //   type: "PLAYLIST",
                                    // })
                                  }
                                  iconClassName="fill-foreground stroke-0"
                                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 invisible group-hover/menu-item:visible"
                                />
                              </>
                            ) : (
                              <FallbackCoverImage type="item" />
                            )
                          }
                          info={
                            <>
                              <p className="text-foreground font-medium text-13 truncate">
                                {playlist.title}
                              </p>
                              <div className="flex items-center text-11 gap-x-1 text-muted-foreground truncate">
                                <p>Playlist</p>
                                <Dot />
                                {playlist.user && (
                                  <span className="text-11">
                                    {playlist.user.name}
                                  </span>
                                )}
                              </div>
                            </>
                          }
                          right={
                            session?.isPlaying &&
                            session?.snapshot?.contextId === playlist.id && (
                              <WaveForm />
                            )
                          }
                        />
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
}
