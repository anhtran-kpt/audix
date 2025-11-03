"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { meQueryOptions } from "@/features/me/api/me-query-options";
import type { PlaylistItem } from "@/features/playlist/contracts/playlist-dto";
import type { ArtistItem } from "@/features/artist/contracts/artist-dto";
import type { AlbumItem } from "@/features/album/contracts/album-dto";
import { SidebarOverview } from "@/lib/data/me-data";

export type LibraryFilter = "all" | "playlists" | "artists" | "albums";

export type LibraryItem =
  | (PlaylistItem & { type: "PLAYLIST"; source: "liked" | "mine" })
  | (ArtistItem & { type: "ARTIST" })
  | (AlbumItem & { type: "ALBUM" });

export const useLibraryItems = ({
  initialData,
  filter,
}: {
  initialData: SidebarOverview;
  filter: LibraryFilter;
}) => {
  const { data: likedPlaylists } = useQuery({
    ...meQueryOptions.likedPlaylists(),
    initialData: initialData.likedPlaylists,
    initialDataUpdatedAt: Date.now(),
  });
  const { data: myPlaylists } = useQuery({
    ...meQueryOptions.myPlaylists(),
    initialData: initialData.myPlaylists,
    initialDataUpdatedAt: Date.now(),
  });
  const { data: artists } = useQuery({
    ...meQueryOptions.followedArtists(),
    initialData: initialData.followedArtists,
    initialDataUpdatedAt: Date.now(),
  });
  const { data: albums } = useQuery({
    ...meQueryOptions.likedAlbums(),
    initialData: initialData.likedAlbums,
    initialDataUpdatedAt: Date.now(),
  });

  const playlists = useMemo(() => {
    const liked =
      likedPlaylists.items.map((p) => ({
        ...p,
        type: "PLAYLIST" as const,
        source: "liked" as const,
      })) ?? [];
    const mine =
      myPlaylists.items.map((p) => ({
        ...p,
        type: "PLAYLIST" as const,
        source: "mine" as const,
      })) ?? [];
    return [...mine, ...liked];
  }, [likedPlaylists, myPlaylists]);

  const filteredItems: LibraryItem[] = useMemo(() => {
    switch (filter) {
      case "playlists":
        return playlists;
      case "artists":
        return (artists.items ?? []).map((a) => ({
          ...a,
          type: "ARTIST" as const,
        }));
      case "albums":
        return (albums.items ?? []).map((a) => ({
          ...a,
          type: "ALBUM" as const,
        }));
      case "all":
      default:
        return [
          ...(artists.items ?? []).map((a) => ({
            ...a,
            type: "ARTIST" as const,
          })),
          ...(albums.items ?? []).map((a) => ({
            ...a,
            type: "ALBUM" as const,
          })),
          ...playlists,
        ];
    }
  }, [filter, playlists, artists, albums]);

  return {
    playlists,
    artists,
    albums,
    filteredItems,
  };
};
