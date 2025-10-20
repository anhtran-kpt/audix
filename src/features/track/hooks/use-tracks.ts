import { getApi } from "@/lib/http/api";
import { useQuery } from "@tanstack/react-query";
import { TrackItem } from "../contracts/track-dto";
import { RecentlyPlayedTracks } from "../data-access/track-repo";

export const useTrack = (trackId?: string) => {
  return useQuery({
    enabled: !!trackId,
    queryKey: ["tracks", trackId],
    queryFn: () => getApi<TrackItem>(`/tracks/${trackId}`),
  });
};

export const useRecentTracks = () => {
  return useQuery({
    queryKey: ["tracks", "history"],
    queryFn: () => getApi<RecentlyPlayedTracks>(`/tracks/history`),
  });
};
