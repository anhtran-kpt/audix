import { getApi } from "@/lib/http/request";
import { PlaylistDetail, SidebarPlaylist } from "../contracts/playlist-dto";
import { queryOptions } from "@tanstack/react-query";
import { playlistKeys } from "./playlist-keys";
import { zCuidType } from "@/features/shared/contracts/shared-dto";

export const sidebarPlaylistOptions = () => {
  return queryOptions({
    queryKey: playlistKeys.sidebarPlaylists(),
    queryFn: () => getApi<SidebarPlaylist[]>("/me/sidebar/playlists"),
  });
};

export const playlistDetailOption = (playlistId: zCuidType) => {
  return queryOptions({
    enabled: !!playlistId,
    queryKey: playlistKeys.detail(playlistId),
    queryFn: () => getApi<PlaylistDetail>(`/playlists/${playlistId}`),
    initialDataUpdatedAt: Date.now(),
  });
};
