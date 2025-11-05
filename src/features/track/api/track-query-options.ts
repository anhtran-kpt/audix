import { queryOptions } from "@tanstack/react-query";
import { trackKeys } from "./track-keys";
import { getApi } from "@/lib/http/api";
import { trackEndpoints } from "./track-endpoints";
import { TrackCredits } from "../data-access/track-repo";
import { TrackItem } from "../contracts/track-dto";

export const trackQueryOptions = {
  trackDetail: (trackId: string) =>
    queryOptions({
      enabled: !!trackId,
      queryKey: trackKeys.detail(trackId),
      queryFn: () => getApi<TrackItem>(trackEndpoints.detail(trackId)),
    }),

  trackList: (trackIds: string[]) =>
    queryOptions({
      queryKey: trackKeys.list(trackIds),
      queryFn: () =>
        getApi<TrackItem[]>(trackEndpoints.list(), {
          params: { ids: trackIds.join(",") },
        }),
    }),

  trackCredits: (trackId?: string) =>
    queryOptions({
      enabled: !!trackId,
      queryKey: trackKeys.credits(trackId!),
      queryFn: () => getApi<TrackCredits>(trackEndpoints.credits(trackId!)),
    }),
};
