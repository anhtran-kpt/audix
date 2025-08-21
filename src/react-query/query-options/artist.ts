import { SidebarArtist } from "@/contracts/artist";
import { getApi } from "@/lib/http/request";
import { queryOptions } from "@tanstack/react-query";
import { sidebarKeys } from "../keys/sidebar";

export const sidebarArtistOptions = () => {
  return queryOptions({
    queryKey: sidebarKeys.artists(),
    queryFn: () => getApi<SidebarArtist[]>("/me/sidebar/artists"),
  });
};
