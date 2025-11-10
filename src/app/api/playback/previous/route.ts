import { PreviousPlaybackInputSchema } from "@/features/playback/playback-schemas";
import { skipToPrevious } from "@/features/playback/playback-actions";
import { makePOST } from "@/lib/route-factory";

export const POST = makePOST({
  auth: "required",
  body: PreviousPlaybackInputSchema,
  handler: async ({ userId, body }) => {
    return skipToPrevious(userId!, body.positionMs);
  },
});
