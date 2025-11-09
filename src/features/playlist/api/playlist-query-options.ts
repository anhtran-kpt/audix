import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getApi } from "@/lib/http/api";
import { PlaylistItem } from "../contracts/playlist-dto";
import { playlistEndpoints } from "./playlist-endpoints";
import { PaginationParams } from "@/features/shared/contracts/shared-dto";
import { playlistKeys } from "./playlist-keys";
import { PlaylistBanner } from "../data-access/playlist-repo";
import { PlaylistTracks } from "@/lib/data/playlist-data";

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

  banner: (playlistId: string) =>
    queryOptions({
      queryKey: playlistKeys.banner(playlistId),
      queryFn: () =>
        getApi<PlaylistBanner>(playlistEndpoints.banner(playlistId)),
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
