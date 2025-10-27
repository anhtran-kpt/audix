import { queryOptions } from "@tanstack/react-query";

import { playbackEndpoints } from "./playback-endpoints";
import { playbackKeys } from "./playback-keys";
import { getApi } from "@/lib/http/api";
import { HistoryTracks } from "../data-access/playback-repo";

export const playbackQueryOptions = {
  history: () =>
    queryOptions({
      queryKey: playbackKeys.history(),
      queryFn: () => getApi<HistoryTracks>(playbackEndpoints.history),
    }),
};
