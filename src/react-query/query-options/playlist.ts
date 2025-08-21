import { SidebarPlaylist } from "@/contracts/playlist";
import { getApi } from "@/lib/http/request";
import { queryOptions } from "@tanstack/react-query";

export const sidebarPlaylistOptions = () => {
  return queryOptions({
    queryKey: ["me", "sidebar", "playlists"],
    queryFn: () => getApi<SidebarPlaylist[]>("/me/sidebar/playlists"),
  });
};
