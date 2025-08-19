import { getApi, postApi } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { TrackDetailDto } from "./schemas";
import { ApiError } from "@/lib/http";

export const useTrack = (trackId?: string) => {
  return useQuery<TrackDetailDto, ApiError>({
    queryKey: ["tracks", trackId],
    queryFn: () => getApi<TrackDetailDto>(`/api/tracks/${trackId}`),
    enabled: !!trackId,
  });
};

export const useTracks = (trackIds: string[]) => {
  return useQuery<TrackDetailDto[], ApiError>({
    queryKey: ["tracks", ...trackIds],
    queryFn: () => postApi(`/api/tracks`, { trackIds }),
  });
};
