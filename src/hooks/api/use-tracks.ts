import { getApi, postApi } from "@/lib/http/request";
import { TrackDetailDto } from "@/server/modules/track/contracts";
import { useQuery } from "@tanstack/react-query";

export const useTrack = (trackId?: string) => {
  return useQuery({
    enabled: !!trackId,
    queryKey: ["tracks", trackId],
    queryFn: () => getApi<TrackDetailDto>(`/api/tracks/${trackId}`),
    staleTime: 60_000,
  });
};

export const useTracks = (trackIds?: string[]) => {
  return useQuery({
    enabled: trackIds !== undefined && trackIds.length > 0,
    queryKey: ["tracks", { ids: trackIds }],
    queryFn: () => postApi<TrackDetailDto[]>(`/api/tracks`, { trackIds }),
    staleTime: 60_000,
  });
};

export const useRecentTracks = () => {
  return useQuery({
    queryKey: ["tracks", "recently"],
    queryFn: () => getApi<TrackDetailDto[]>(`/api/tracks/recently`),
  });
};
