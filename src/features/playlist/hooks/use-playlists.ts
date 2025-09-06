import { zCuidType } from "@/features/shared/contracts/shared-dto";
import { getApi } from "@/lib/http/request";
import { useQuery } from "@tanstack/react-query";
import { FullPlaylist } from "../contracts/playlist-dto";

export const usePlaylist = (playlistId?: zCuidType) => {
  return useQuery({
    enabled: !!playlistId,
    queryKey: ["playlists", playlistId],
    queryFn: () => getApi<FullPlaylist>(`/playlists/${playlistId}`),
  });
};
