import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getApi } from "@/lib/api";
import { playlistEndpoints } from "./playlist-endpoints";
import { PaginationParams } from "@/features/shared/shared-types";
import { playlistKeys } from "./playlist-keys";
import {
  PlaylistItem,
  PlaylistOverview,
  PlaylistTracks,
} from "./playlist-types";

export const playlistQueryOptions = {
  list: (params?: Partial<PaginationParams>) =>
    queryOptions({
      queryKey: playlistKeys.list(params),
      queryFn: () => getApi<PlaylistItem[]>(playlistEndpoints.list()),
    }),

  detail: (playlistId: string) =>
    queryOptions({
      queryKey: playlistKeys.detail(playlistId),
      queryFn: () =>
        getApi<PlaylistItem[]>(playlistEndpoints.detail(playlistId)),
    }),

  overview: (playlistId: string) =>
    queryOptions({
      queryKey: playlistKeys.overview(playlistId),
      queryFn: () =>
        getApi<PlaylistOverview>(playlistEndpoints.overview(playlistId)),
      enabled: !!playlistId,
    }),

  tracks: (playlistId: string) =>
    queryOptions({
      queryKey: playlistKeys.tracks(playlistId),
      queryFn: () =>
        getApi<PlaylistTracks>(playlistEndpoints.tracks(playlistId)),
      enabled: !!playlistId,
      placeholderData: keepPreviousData,
    }),
} as const;
