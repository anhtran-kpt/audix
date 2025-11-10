import { getClientPlaybackSession } from "@/features/playback/playback-actions";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  handler: async ({ userId }) => {
    return getClientPlaybackSession(userId!);
  },
});
