import { queryOptions } from "@tanstack/react-query";
import { meKeys } from "./me-keys";
import { meEndpoints } from "./me-endpoints";
import { getApi } from "@/lib/http/api";
import {
  LikedAlbumStatus,
  LikedPlaylistStatus,
  MyBanner,
  MyFollowedArtists,
  MyFollowedUsers,
  MyFollowers,
  MyLikedAlbums,
  MyLikedPlaylists,
  MyPlaylists,
} from "../data-access/me-repo";
import { PaginationParams } from "@/features/shared/contracts/shared-dto";

export const meQueryOptions = {
  banner: () =>
    queryOptions({
      queryKey: meKeys.banner(),
      queryFn: () => getApi<MyBanner>(meEndpoints.banner()),
    }),

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
} as const;
