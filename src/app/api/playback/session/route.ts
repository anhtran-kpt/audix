import { getPlaybackSession } from "@/features/playback/data-access/playback-repo";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  handler: async ({ userId }) => {
    return getPlaybackSession(userId!);
  },
});
