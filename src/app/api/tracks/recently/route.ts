import { makeGET } from "@/server/api/route-factory";
import { getRecentTracks } from "@/server/modules/track/services";

export const GET = makeGET({
  auth: "required",
  handler: async ({ userId }) => {
    return getRecentTracks(userId!);
  },
});
