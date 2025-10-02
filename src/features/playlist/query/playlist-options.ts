import { getApi } from "@/lib/http/request";
import { queryOptions } from "@tanstack/react-query";
import { playlistKeys } from "./playlist-keys";
import { PlaylistDetail } from "../data-access/playlist-repo";

export const sidebarPlaylistOptions = () => {
  return queryOptions({
    queryKey: playlistKeys.sidebarPlaylists(),
    queryFn: () => getApi<SidebarPlaylist[]>("/me/sidebar/playlists"),
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
