import { getApi } from "@/lib/http/request";
import { queryOptions } from "@tanstack/react-query";
import { playlistKeys } from "./playlist-keys";
import { PlaylistDetail } from "../data-access/playlist-repo";
import { PlaylistItem } from "../contracts/playlist-dto";
import { playlistEndpoints } from "./playlist-endpoints";

export const playlistsListOption = () => {
  return queryOptions({
    queryKey: playlistKeys.list(),
    queryFn: () => getApi<PlaylistItem[]>(playlistEndpoints.list()),
  });
};

export const playlistDetailOption = (playlistId: string) => {
  return queryOptions({
    enabled: !!playlistId,
    queryKey: playlistKeys.detail(playlistId),
    queryFn: () => getApi<PlaylistDetail>(`/playlists/${playlistId}`),
    initialDataUpdatedAt: Date.now(),
  });
};
