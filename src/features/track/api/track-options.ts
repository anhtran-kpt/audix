import { queryOptions } from "@tanstack/react-query";
import { trackKeys } from "./track-keys";
import { getApi } from "@/lib/http/api";
import { trackEndpoints } from "./track-endpoints";
import { TrackCredits } from "../data-access/track-repo";
import { TrackItem } from "../contracts/track-dto";

export const trackListOptions = (trackIds: string[]) => {
  return queryOptions({
    queryKey: trackKeys.list(trackIds),
    queryFn: () =>
      getApi<TrackItem[]>(trackEndpoints.list(), {
        params: { ids: trackIds.join(",") },
      }),
  });
};

export const trackCreditsOptions = (trackId?: string) => {
  return queryOptions({
    enabled: !!trackId,
    queryKey: trackKeys.credits(trackId!),
    queryFn: () => getApi<TrackCredits>(trackEndpoints.credits(trackId!)),
  });
};
