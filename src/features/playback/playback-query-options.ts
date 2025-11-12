import { queryOptions } from "@tanstack/react-query";
import { playbackEndpoints } from "./playback-endpoints";
import { playbackKeys } from "./playback-keys";
import { getApi } from "@/lib/api";
import { HistoryTracks } from "./playback-actions";

export const playbackQueryOptions = {
  history: () =>
    queryOptions({
      queryKey: playbackKeys.history(),
      queryFn: () => getApi<HistoryTracks>(playbackEndpoints.history),
    }),
};
