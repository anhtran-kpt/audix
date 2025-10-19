import { getApi, postApi } from "@/lib/http/api";
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

export const useTracks = (trackIds: string[]) => {
  return useQuery({
    queryKey: ["tracks", trackIds.join(",")],
    queryFn: () => postApi<TrackItem[]>(`/tracks`, { body: { trackIds } }),
  });
};

export const useRecentTracks = () => {
  return useQuery({
    queryKey: ["tracks", "history"],
    queryFn: () => getApi<RecentlyPlayedTracks>(`/tracks/history`),
  });
};
