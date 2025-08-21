import { SidebarPlaylist } from "@/contracts/playlist";
import { getApi } from "@/lib/http/request";
import { queryOptions } from "@tanstack/react-query";
import { sidebarKeys } from "../keys/sidebar";

export const sidebarPlaylistOptions = () => {
  return queryOptions({
    queryKey: sidebarKeys.playlists(),
    queryFn: () => getApi<SidebarPlaylist[]>("/me/sidebar/playlists"),
  });
};
