import { getJSON } from "@/lib/http/request";
import type { RecentlyTracksOutput } from "@/server/contracts/recently.contract";

export async function fetchRecentlyTracks(limit = 30) {
  return getJSON<RecentlyTracksOutput>(`/api/recently/tracks?limit=${limit}`);
}
