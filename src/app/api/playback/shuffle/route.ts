import { ShufflePlaybackInputSchema } from "@/features/playback/playback-schemas";
import { shufflePlayback } from "@/features/playback/playback-actions";
import { makePATCH } from "@/lib/route-factory";

export const PATCH = makePATCH({
  auth: "required",
  body: ShufflePlaybackInputSchema,
  handler: async ({ userId, body }) => {
    return shufflePlayback(userId!, body);
  },
});
