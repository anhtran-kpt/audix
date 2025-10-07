import { getApi } from "@/lib/http/api";
import { queryOptions } from "@tanstack/react-query";
import { playlistKeys } from "./playlist-keys";
import { PlaylistDetail } from "../data-access/playlist-repo";

export const playlistDetailOption = (playlistId: string) => {
  return queryOptions({
    enabled: !!playlistId,
    queryKey: playlistKeys.detail(playlistId),
    queryFn: () => getApi<PlaylistDetail>(`/playlists/${playlistId}`),
    initialDataUpdatedAt: Date.now(),
  });
};
