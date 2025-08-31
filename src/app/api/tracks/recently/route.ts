import { getRecentTracks } from "@/features/track/data-access/track-repos";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  handler: async ({ userId }) => {
    return getRecentTracks(userId!);
  },
});
