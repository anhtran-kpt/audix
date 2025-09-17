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
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { NewPlaylistDialog } from "./new-playlist-dialog";
import { usePathname } from "next/navigation";
import { CoverImage } from "../ui/cover-image";
import Dot from "../ui/dot";
import { FallbackCoverImage } from "./fallback-cover-image";
import { ArtistImage } from "../ui/artist-image";
import { ScrollArea } from "../ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { SidebarArtist } from "@/features/artist/contracts/artist-dto";
import { SidebarPlaylist } from "@/features/playlist/contracts/playlist-dto";
import { sidebarPlaylistOptions } from "@/features/playlist/query/playlist-options";
import { sidebarArtistOptions } from "@/features/artist/query/artist-options";
import { useIsPlaying, usePlaybackContext } from "@/hooks/use-audio-player";
import WaveForm from "../ui/wave-form";
import { IconButton } from "../ui/icon-button";
import { PanelLeftCloseIcon, PanelRightCloseIcon } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

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

  const playbackContext = usePlaybackContext();
  const isPlaying = useIsPlaying();

  const [filter, setFilter] = useState<"all" | "artists" | "playlists">("all");

  return (
    <Sidebar collapsible="icon" variant="inset" className="group">
      <SidebarHeader>
        <div className="flex items-center [--icon-w:1.25rem]">
          <div className="w-0 overflow-hidden transition-[width] duration-300 group-hover:w-[var(--icon-w)] flex items-center">
            <IconButton
              icon={open ? PanelLeftCloseIcon : PanelRightCloseIcon}
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
      </SidebarHeader>

      <SidebarContent>
        <div className="p-2">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
            <TabsList className="w-full bg-sidebar">
              <TabsTrigger value="all" className="flex-1">
                All
              </TabsTrigger>
              <TabsTrigger value="playlists" className="flex-1">
                Playlists
              </TabsTrigger>
              <TabsTrigger value="artists" className="flex-1">
                Artists
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

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
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <ArtistImage
                            src={artist.imageId}
                            alt={artist.name}
                            size="sm"
                          />
                          <div className="flex flex-col gap-0.5 w-full overflow-hidden">
                            <p className="text-foreground font-medium text-[13px] truncate">
                              {artist.name}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate font-normal">
                              Artist
                            </p>
                          </div>
                        </div>
                        {isPlaying &&
                          playbackContext?.contextId === artist.id && (
                            <WaveForm />
                          )}
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
                            <p className="text-foreground font-medium text-[13px] truncate">
                              {playlist.title}
                            </p>
                            <div className="flex items-center text-[11px] gap-x-1 text-muted-foreground truncate">
                              <p>Playlist</p>
                              <Dot />
                              {playlist.user && (
                                <span className="text-[11px]">
                                  {playlist.user.name}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {isPlaying &&
                          playbackContext?.contextId === playlist.id && (
                            <WaveForm />
                          )}
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
