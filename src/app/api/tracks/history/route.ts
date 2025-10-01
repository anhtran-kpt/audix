import { getRecentlyPlayedTracks } from "@/features/track/data-access/track-repo";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  handler: async ({ userId }) => {
    return getRecentlyPlayedTracks(userId!);
  },
});
