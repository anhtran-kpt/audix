import { queryOptions } from "@tanstack/react-query";
import { meKeys } from "./me-keys";
import { meEndpoints } from "./me-endpoints";
import { getApi } from "@/lib/axios";
import { PaginationParams } from "@/features/shared/shared-types";
import {
  LikedAlbumStatus,
  LikedPlaylistStatus,
  MyFavoriteSongsPlaylist,
  MyFollowedArtists,
  MyLikedAlbums,
  MyLikedPlaylists,
  MyPlaylists,
} from "@/features/me/me-data";

export const meQueryOptions = {
  myPlaylists: (params?: Partial<PaginationParams>) =>
    queryOptions({
      queryKey: meKeys.myPlaylists(params),
      queryFn: () => getApi<MyPlaylists>(meEndpoints.myPlaylists(), { params }),
    }),

  likedPlaylists: (params?: Partial<PaginationParams>) =>
    queryOptions({
      queryKey: meKeys.likedPlaylists(params),
      queryFn: () => getApi<MyLikedPlaylists>(meEndpoints.likedPlaylists()),
    }),

  likedPlaylistStatus: (playlistId: string) =>
    queryOptions({
      queryKey: meKeys.likedPlaylistStatus(playlistId),
      queryFn: () =>
        getApi<LikedPlaylistStatus>(
          meEndpoints.likedPlaylistStatus(playlistId)
        ),
    }),

  likedAlbums: (params?: Partial<PaginationParams>) =>
    queryOptions({
      queryKey: meKeys.likedAlbums(params),
      queryFn: () => getApi<MyLikedAlbums>(meEndpoints.likedAlbums()),
    }),

  likedAlbumStatus: (albumId: string) =>
    queryOptions({
      queryKey: meKeys.likedAlbumStatus(albumId),
      queryFn: () =>
        getApi<LikedAlbumStatus>(meEndpoints.likedAlbumStatus(albumId)),
    }),

  followedArtists: (params?: Partial<PaginationParams>) =>
    queryOptions({
      queryKey: meKeys.followedArtists(params),
      queryFn: () =>
        getApi<MyFollowedArtists>(meEndpoints.followedArtists(), { params }),
    }),

  favoriteSongsPlaylist: () =>
    queryOptions({
      queryKey: meKeys.favoriteSongsPlaylist(),
      queryFn: () =>
        getApi<MyFavoriteSongsPlaylist>(meEndpoints.favoriteSongsPlaylist()),
    }),
} as const;
