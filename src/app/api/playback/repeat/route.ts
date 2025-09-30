import { RepeatPlaybackInputSchema } from "@/features/playback/contracts/playback-schema";
import { repeatPlayback } from "@/features/playback/data-access/playback-repo";
import { makePATCH } from "@/lib/route-factory";

export const PATCH = makePATCH({
  auth: "required",
  body: RepeatPlaybackInputSchema,
  handler: async ({ userId, body }) => {
    return repeatPlayback(userId!, body);
  },
});
