import { getApi } from "@/lib/http/request";
import { SidebarPlaylist } from "../contracts/playlist-dto";
import { queryOptions } from "@tanstack/react-query";
import { playlistKeys } from "./playlist-keys";

export const sidebarPlaylistOptions = () => {
  return queryOptions({
    queryKey: playlistKeys.sidebarPlaylists(),
    queryFn: () => getApi<SidebarPlaylist[]>("/me/sidebar/playlists"),
  });
};
