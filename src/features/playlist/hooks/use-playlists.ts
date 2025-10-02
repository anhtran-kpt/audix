import { getApi } from "@/lib/http/request";
import { useQuery } from "@tanstack/react-query";

export const usePlaylist = (playlistId?: string) => {
  return useQuery({
    enabled: !!playlistId,
    queryKey: ["playlists", playlistId],
    queryFn: () => getApi<FullPlaylist>(`/playlists/${playlistId}`),
  });
};
