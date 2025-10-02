import { getApi, postApi } from "@/lib/http/request";
import { useQuery } from "@tanstack/react-query";
import { TrackListItem } from "../contracts/track-dto";

export const useTrack = (trackId?: string) => {
  return useQuery({
    enabled: !!trackId,
    queryKey: ["tracks", trackId],
    queryFn: () => getApi<TrackListItem>(`/tracks/${trackId}`),
  });
};

export const useTracks = (trackIds?: string[]) => {
  return useQuery({
    enabled: trackIds !== undefined && trackIds.length > 0,
    queryKey: ["tracks", { ids: trackIds }],
    queryFn: () => postApi<TrackListItem[]>(`/tracks`, { trackIds }),
  });
};

export const useRecentTracks = () => {
  return useQuery({
    queryKey: ["tracks", "history"],
    queryFn: () => getApi<TrackListItem[]>(`/tracks/history`),
  });
};
