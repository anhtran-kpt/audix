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
import {
  PlusIcon,
  PanelLeftCloseIcon,
  PanelRightCloseIcon,
  ChevronDownIcon,
  FilterIcon,
  PinIcon,
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
import { MiniPlayContextButton } from "./play/mini-play-context-button";
import { SidebarOverview } from "@/features/me/me-data";
import { cn } from "@/lib/utils";
import pluralize from "pluralize";
import { useQuery } from "@tanstack/react-query";
import {
  LibraryFilter,
  useLibraryItems,
} from "@/features/shared/hooks/use-library-items";
import { meQueryOptions } from "@/features/me/me-query-options";

export function AppSidebar({ initialData }: { initialData: SidebarOverview }) {
  const pathname = usePathname();
  const { openDialog } = useNewPlaylistDialog();
  const { toggleSidebar, open } = useSidebar();
  const router = useRouter();
  const [filter, setFilter] = useState<LibraryFilter>("all");
  const { filteredItems } = useLibraryItems({ filter, initialData });
  const { data: favoriteSongsPlaylist } = useQuery({
    ...meQueryOptions.favoriteSongsPlaylist(),
    initialData: initialData.favoriteSongsPlaylist,
    initialDataUpdatedAt: Date.now(),
  });

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
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={toggleSidebar}
                    className="w-[var(--icon-w)] h-[var(--icon-w)] -translate-x-2 group-hover:translate-x-0 transition-transform duration-300"
                  >
                    <PanelLeftCloseIcon className="size-5" />
                  </Button>
                </div>

                <span className="truncate duration-300 group-hover:ml-2 font-semibold">
                  Your Library
                </span>
              </div>

              <Button size="icon" variant="ghost" onClick={openDialog}>
                <PlusIcon className="size-6" />
              </Button>
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
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                <PanelRightCloseIcon className="size-6" />
              </Button>
            </div>
            <div className="flex items-center justify-center">
              <Button variant="ghost" size="icon" onClick={openDialog}>
                <PlusIcon className="size-6" />
              </Button>
            </div>
          </>
        )}
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="h-full min-h-0" scrollBarClassName="w-2">
          <SidebarGroup className="h-full">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  size="lg"
                  asChild
                  isActive={
                    pathname === `/playlists/${favoriteSongsPlaylist.id}`
                  }
                >
                  <div
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(`/playlists/${favoriteSongsPlaylist.id}`)
                    }
                  >
                    <SidebarItemWrapper
                      open={open}
                      image={
                        <>
                          <AppImage
                            fill
                            sizes="40px"
                            className={`rounded-sm group-hover/menu-item:brightness-65`}
                            alt={favoriteSongsPlaylist.title}
                            src={
                              favoriteSongsPlaylist.imageId ??
                              process.env.NEXT_PUBLIC_FALLBACK_PLAYLIST_COVER!
                            }
                            containerClassName="size-10"
                            priority
                          />
                          <MiniPlayContextButton
                            context={{
                              contextType: "PLAYLIST",
                              contextId: favoriteSongsPlaylist.id,
                            }}
                            className="hidden group-hover/menu-item:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                          />
                        </>
                      }
                      info={
                        <>
                          <p className="font-medium text-[calc(13rem/16)] truncate">
                            {favoriteSongsPlaylist.title}
                          </p>
                          <div className="flex items-center text-[calc(11rem/16)] text-muted-foreground gap-x-1 truncate">
                            <div className="flex items-center gap-1">
                              <PinIcon className="size-3 text-green-600 fill-green-600 rotate-45" />
                              Playlist
                            </div>

                            <>
                              <Dot />
                              <span>
                                {favoriteSongsPlaylist.totalTracks}{" "}
                                {pluralize(
                                  "song",
                                  favoriteSongsPlaylist.totalTracks
                                )}
                              </span>
                            </>
                          </div>
                        </>
                      }
                      right={
                        isPlaying &&
                        contextId === favoriteSongsPlaylist.id && <VolumeIcon />
                      }
                    />
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
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
                                containerClassName={cn(
                                  "size-10",
                                  isArtist && "rounded-full"
                                )}
                                priority
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
