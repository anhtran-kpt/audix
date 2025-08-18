import { RecentlyTracksInput } from "@/server/contracts/recently.contract";
import { makeGET } from "@/server/handlers/route-factory";
import { getRecentlyPlayedTracks } from "@/server/services/recently.service";

export const GET = makeGET({
  auth: "required",
  query: RecentlyTracksInput,
  handler: async ({ userId, query }) => {
    return getRecentlyPlayedTracks(userId!, query);
  },
});
