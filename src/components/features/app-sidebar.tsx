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
import { usePathname, useRouter } from "next/navigation";
import Dot from "../ui/dot";
import { ScrollArea } from "../ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { IconButton } from "../ui/icon-button";
import {
  PlusIcon,
  PanelLeftCloseIcon,
  PanelRightCloseIcon,
  ChevronDownIcon,
  FilterIcon,
} from "lucide-react";
import { useState } from "react";
import { SidebarItemWrapper } from "../shared/sidebar-item-wrapper";
import { usePlaybackStore } from "@/stores/use-playback-store";
import { RowPlayButton } from "../shared/row-play-button";
import { useShallow } from "zustand/react/shallow";
import { VolumeIcon } from "../shared/volume-icon";
import { AppImage } from "../shared/app-image";
import { useNewPlaylistDialog } from "@/stores/use-new-playlist-dialog";
import { meQueryOptions } from "@/features/me/api/me-query-options";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

export function AppSidebar() {
  const pathname = usePathname();
  const { openDialog } = useNewPlaylistDialog();
  const { toggleSidebar, open } = useSidebar();
  const router = useRouter();

  const { data: playlists } = useQuery({
    ...meQueryOptions.libraryPlaylists(),
  });

  const { data: artists } = useQuery({
    ...meQueryOptions.followedArtists(),
  });

  const { data: albums } = useQuery({
    ...meQueryOptions.likedAlbums(),
  });

  const { isPlaying, contextId } = usePlaybackStore(
    useShallow((s) => ({
      isPlaying: s.isPlaying,
      contextId: s.session?.snapshot?.contextId,
    }))
  );

  const [filter, setFilter] = useState("all");

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

              <IconButton
                icon={PlusIcon}
                aria-label="New playlist"
                tooltipContent="New playlist"
                iconClassName="size-6"
                onClick={openDialog}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-1 w-full rounded-full justify-between"
                >
                  <div className="flex items-center gap-2">
                    <FilterIcon />
                    Filter:{" "}
                    {filter === "all"
                      ? "All"
                      : filter === "playlists"
                      ? "Playlists"
                      : filter === "artists"
                      ? "Artists"
                      : "Albums"}
                  </div>
                  <ChevronDownIcon />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-32">
                <DropdownMenuRadioGroup
                  value={filter}
                  onValueChange={setFilter}
                >
                  <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="artists">
                    Artists
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="playlists">
                    Playlists
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="albums">
                    Albums
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
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
              <IconButton
                icon={PlusIcon}
                aria-label="New playlist"
                tooltipContent="New playlist"
                iconClassName="size-6"
                onClick={openDialog}
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
                artists?.map((artist) => (
                  <SidebarMenuItem key={artist.id}>
                    <SidebarMenuButton
                      size="lg"
                      asChild
                      isActive={pathname === `/artists/${artist.id}`}
                    >
                      <div
                        onClick={() => router.push(`/artists/${artist.id}`)}
                        className="cursor-pointer"
                      >
                        <SidebarItemWrapper
                          open={open}
                          image={
                            <>
                              <AppImage
                                fill
                                sizes="40px"
                                className="rounded-full group-hover/menu-item:brightness-65"
                                alt={artist.name}
                                src={artist.imageId}
                                containerClassName="size-10"
                              />
                              <RowPlayButton
                                context={{
                                  contextType: "ARTIST",
                                  contextId: artist.id,
                                }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 invisible group-hover/menu-item:visible"
                              />
                            </>
                          }
                          info={
                            <>
                              <p className="text-foreground font-medium text-[calc(13rem/16)] truncate">
                                {artist.name}
                              </p>
                              <p className="text-[calc(11rem/16)] text-muted-foreground truncate font-normal">
                                Artist
                              </p>
                            </>
                          }
                          right={
                            isPlaying &&
                            contextId === artist.id && <VolumeIcon />
                          }
                        />
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

              {(filter === "all" || filter === "playlists") &&
                playlists?.map((playlist) => (
                  <SidebarMenuItem key={playlist.id}>
                    <SidebarMenuButton
                      size="lg"
                      asChild
                      isActive={pathname === `/playlists/${playlist.id}`}
                    >
                      <div
                        onClick={() => router.push(`/playlists/${playlist.id}`)}
                        className="cursor-pointer"
                      >
                        <SidebarItemWrapper
                          open={open}
                          image={
                            <>
                              <AppImage
                                fill
                                sizes="40px"
                                className="group-hover/menu-item:brightness-65"
                                alt={playlist.title}
                                src={
                                  playlist.imageId ??
                                  process.env
                                    .NEXT_PUBLIC_FALLBACK_PLAYLIST_COVER!
                                }
                                containerClassName="size-10"
                              />
                              <RowPlayButton
                                context={{
                                  contextType: "PLAYLIST",
                                  contextId: playlist.id,
                                }}
                                className="hidden group-hover/menu-item:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                              />
                            </>
                          }
                          info={
                            <>
                              <p className="text-foreground font-medium text-[calc(13rem/16)] truncate">
                                {playlist.title}
                              </p>
                              <div className="flex items-center text-[calc(11rem/16)] gap-x-1 text-muted-foreground truncate">
                                <p>Playlist</p>
                                <Dot />
                                {playlist.user && (
                                  <span className="text-[calc(11rem/16)]">
                                    {playlist.user.name}
                                  </span>
                                )}
                              </div>
                            </>
                          }
                          right={
                            isPlaying &&
                            contextId === playlist.id && <VolumeIcon />
                          }
                        />
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

              {(filter === "all" || filter === "albums") &&
                albums?.map((album) => (
                  <SidebarMenuItem key={album.id}>
                    <SidebarMenuButton
                      size="lg"
                      asChild
                      isActive={pathname === `/albums/${album.id}`}
                    >
                      <div
                        onClick={() => router.push(`/albums/${album.id}`)}
                        className="cursor-pointer"
                      >
                        <SidebarItemWrapper
                          open={open}
                          image={
                            <>
                              <AppImage
                                fill
                                sizes="40px"
                                className="group-hover/menu-item:brightness-65"
                                alt={album.title}
                                src={album.imageId}
                                containerClassName="size-10"
                              />
                              <RowPlayButton
                                context={{
                                  contextType: "ALBUM",
                                  contextId: album.id,
                                }}
                                className="hidden group-hover/menu-item:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                              />
                            </>
                          }
                          info={
                            <>
                              <p className="text-foreground font-medium text-[calc(13rem/16)] truncate">
                                {album.title}
                              </p>
                              <div className="flex items-center text-[calc(11rem/16)] gap-x-1 text-muted-foreground truncate">
                                <p>Album</p>
                                <Dot />
                                {album.artist && (
                                  <span className="text-[calc(11rem/16)]">
                                    {album.artist.name}
                                  </span>
                                )}
                              </div>
                            </>
                          }
                          right={
                            isPlaying &&
                            contextId === album.id && <VolumeIcon />
                          }
                        />
                      </div>
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
