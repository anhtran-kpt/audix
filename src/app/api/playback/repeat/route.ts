import { RepeatPlaybackInputSchema } from "@/features/playback/contracts/playback-dto";
import { repeatPlayback } from "@/features/playback/data-access/playback-repos";
import { makePATCH } from "@/lib/route-factory";

export const PATCH = makePATCH({
  auth: "required",
  body: RepeatPlaybackInputSchema,
  handler: async ({ userId, body }) => {
    return repeatPlayback(userId!, body);
  },
});
