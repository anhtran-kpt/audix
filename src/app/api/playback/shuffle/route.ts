import { ShufflePlaybackInputSchema } from "@/features/playback/contracts/playback-schema";
import { shufflePlayback } from "@/features/playback/data-access/playback-repo";
import { makePATCH } from "@/lib/route-factory";

export const PATCH = makePATCH({
  auth: "required",
  body: ShufflePlaybackInputSchema,
  handler: async ({ userId, body }) => {
    return shufflePlayback(userId!, body);
  },
});
