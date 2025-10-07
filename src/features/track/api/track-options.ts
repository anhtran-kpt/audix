import { queryOptions } from "@tanstack/react-query";
import { trackKeys } from "./track-keys";
import { getApi } from "@/lib/http/api";
import { trackEndpoints } from "./track-endpoints";
import { TrackCredits } from "../data-access/track-repo";

export const trackCreditsOptions = (trackId?: string) => {
  return queryOptions({
    enabled: !!trackId,
    queryKey: trackKeys.credits(trackId!),
    queryFn: () => getApi<TrackCredits>(trackEndpoints.credits(trackId!)),
  });
};
