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
import { useShallow } from "zustand/react/shallow";
import { VolumeIcon } from "../shared/volume-icon";
import { AppImage } from "../shared/app-image";
import { useNewPlaylistDialog } from "@/stores/use-new-playlist-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { LibraryFilter, useLibraryItems } from "@/hooks/use-library-items";
import { MiniPlayContextButton } from "./play/mini-play-context-button";

export function AppSidebar() {
  const pathname = usePathname();
  const { openDialog } = useNewPlaylistDialog();
  const { toggleSidebar, open } = useSidebar();
  const router = useRouter();
  const [filter, setFilter] = useState<LibraryFilter>("all");
  const { filteredItems } = useLibraryItems(filter);

  const { isPlaying, contextId } = usePlaybackStore(
    useShallow((s) => ({
      isPlaying: s.isPlaying,
      contextId: s.session?.snapshot?.contextId,
    }))
  );

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
                  onValueChange={setFilter as any}
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
              {filteredItems.map((item) => {
                const isArtist = "type" in item && item.type === "ARTIST";
                const isAlbum = "type" in item && item.type === "ALBUM";
                const isPlaylist = "source" in item;

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      size="lg"
                      asChild
                      isActive={
                        pathname ===
                        `/${
                          isArtist
                            ? "artists"
                            : isAlbum
                            ? "albums"
                            : "playlists"
                        }/${item.id}`
                      }
                    >
                      <div
                        className="cursor-pointer"
                        onClick={() =>
                          router.push(
                            `/${
                              isArtist
                                ? "artists"
                                : isAlbum
                                ? "albums"
                                : "playlists"
                            }/${item.id}`
                          )
                        }
                      >
                        <SidebarItemWrapper
                          open={open}
                          image={
                            <>
                              <AppImage
                                fill
                                sizes="40px"
                                className={`rounded-${
                                  isArtist ? "full" : "sm"
                                } group-hover/menu-item:brightness-65`}
                                alt={isArtist ? item.name : item.title}
                                src={
                                  item.imageId ??
                                  process.env
                                    .NEXT_PUBLIC_FALLBACK_PLAYLIST_COVER!
                                }
                                containerClassName="size-10"
                              />
                              <MiniPlayContextButton
                                context={{
                                  contextType: item.type,
                                  contextId: item.id,
                                }}
                                className="hidden group-hover/menu-item:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                              />
                            </>
                          }
                          info={
                            <>
                              <p className="font-medium text-[calc(13rem/16)] truncate">
                                {isArtist ? item.name : item.title}
                              </p>
                              <div className="flex items-center text-[calc(11rem/16)] text-muted-foreground gap-x-1 truncate">
                                <p>
                                  {isArtist
                                    ? "Artist"
                                    : isAlbum
                                    ? "Album"
                                    : "Playlist"}
                                </p>

                                {isAlbum && item.artist && (
                                  <>
                                    <Dot />
                                    <span>{item.artist.name}</span>
                                  </>
                                )}
                                {isPlaylist && item.user && (
                                  <>
                                    <Dot />
                                    <span>{item.user.name}</span>
                                  </>
                                )}
                              </div>
                            </>
                          }
                          right={
                            isPlaying && contextId === item.id && <VolumeIcon />
                          }
                        />
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
}
