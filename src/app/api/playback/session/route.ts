import { getPlaybackSession } from "@/features/playback/data-access/playback-repos";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  handler: async ({ userId }) => {
    return getPlaybackSession(userId!);
  },
});
