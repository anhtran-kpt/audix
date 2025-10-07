import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getApi } from "@/lib/http/api";
import { AlbumItem } from "../contracts/album-dto";
import { albumEndpoints } from "./album-endpoints";
import { PaginationParams } from "@/features/shared/contracts/shared-dto";
import { albumKeys } from "./album-keys";
import {
  AlbumBanner,
  AlbumSuggestions,
  AlbumTracks,
} from "../data-access/album-repo";

export const albumQueryOptions = {
  list: (params?: Partial<PaginationParams>) =>
    queryOptions({
      queryKey: albumKeys.list(params),
      queryFn: () => getApi<AlbumItem[]>(albumEndpoints.list()),
    }),
  detail: (albumId: string) =>
    queryOptions({
      queryKey: albumKeys.detail(albumId),
      queryFn: () => getApi<AlbumItem[]>(albumEndpoints.detail(albumId)),
    }),

  banner: (albumId: string) =>
    queryOptions({
      queryKey: albumKeys.banner(albumId),
      queryFn: () => getApi<AlbumBanner>(albumEndpoints.banner(albumId)),
      staleTime: Infinity,
      enabled: !!albumId,
    }),
  tracks: (albumId: string) =>
    queryOptions({
      queryKey: albumKeys.tracks(albumId),
      queryFn: () => getApi<AlbumTracks>(albumEndpoints.tracks(albumId)),
      staleTime: Infinity,
      enabled: !!albumId,
      placeholderData: keepPreviousData,
    }),

  suggestions: (albumId: string, params?: Partial<PaginationParams>) =>
    queryOptions({
      queryKey: albumKeys.suggestions(albumId, params),
      queryFn: () =>
        getApi<AlbumSuggestions>(albumEndpoints.suggestions(albumId), {
          params,
        }),
      placeholderData: keepPreviousData,
      enabled: !!albumId,
    }),
} as const;
