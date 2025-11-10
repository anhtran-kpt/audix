import { RepeatPlaybackInputSchema } from "@/features/playback/playback-schemas";
import { repeatPlayback } from "@/features/playback/playback-actions";
import { makePATCH } from "@/lib/route-factory";

export const PATCH = makePATCH({
  auth: "required",
  body: RepeatPlaybackInputSchema,
  handler: async ({ userId, body }) => {
    return repeatPlayback(userId!, body);
  },
});
