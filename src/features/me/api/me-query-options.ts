import { queryOptions } from "@tanstack/react-query";
import { meKeys } from "./me-keys";
import { meEndpoints } from "./me-endpoints";
import { getApi } from "@/lib/http/api";
import { PaginationParams } from "@/features/shared/contracts/shared-dto";
import {
  LikedAlbumStatus,
  LikedPlaylistStatus,
  MyFavoriteSongsPlaylist,
  MyFollowedArtists,
  MyFollowedUsers,
  MyFollowers,
  MyLikedAlbums,
  MyLikedPlaylists,
  MyPlaylists,
} from "@/lib/data/me-data";

export const meQueryOptions = {
  followers: (params?: Partial<PaginationParams>) =>
    queryOptions({
      queryKey: meKeys.followers(params),
      queryFn: () => getApi<MyFollowers>(meEndpoints.followers()),
    }),

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

  followedUsers: (params?: Partial<PaginationParams>) =>
    queryOptions({
      queryKey: meKeys.followedUsers(params),
      queryFn: () =>
        getApi<MyFollowedUsers>(meEndpoints.followedUsers(), { params }),
    }),

  favoriteSongsPlaylist: () =>
    queryOptions({
      queryKey: meKeys.favoriteSongsPlaylist(),
      queryFn: () =>
        getApi<MyFavoriteSongsPlaylist>(meEndpoints.favoriteSongsPlaylist()),
    }),
} as const;
