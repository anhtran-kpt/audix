import { getApi, postApi } from "@/lib/http/request";
import { useQuery } from "@tanstack/react-query";
import { FullTrack } from "../contracts/track-dto";

export const useTrack = (trackId?: string) => {
  return useQuery({
    enabled: !!trackId,
    queryKey: ["tracks", trackId],
    queryFn: () => getApi<FullTrack>(`/tracks/${trackId}`),
  });
};

export const useTracks = (trackIds?: string[]) => {
  return useQuery({
    enabled: trackIds !== undefined && trackIds.length > 0,
    queryKey: ["tracks", { ids: trackIds }],
    queryFn: () => postApi<FullTrack[]>(`/tracks`, { trackIds }),
  });
};

export const useRecentTracks = () => {
  return useQuery({
    queryKey: ["tracks", "recently"],
    queryFn: () => getApi<FullTrack[]>(`/tracks/recently`),
  });
};
