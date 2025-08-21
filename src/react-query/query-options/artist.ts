import { SidebarArtist } from "@/contracts/artist";
import { getApi } from "@/lib/http/request";
import { queryOptions } from "@tanstack/react-query";

export const sidebarArtistOptions = () => {
  return queryOptions({
    queryKey: ["me", "sidebar", "artists"],
    queryFn: () => getApi<SidebarArtist[]>("/me/sidebar/artists"),
  });
};
