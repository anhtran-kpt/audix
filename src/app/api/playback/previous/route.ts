import { PreviousPlaybackInputSchema } from "@/features/playback/contracts/playback-schema";
import { skipToPrevious } from "@/features/playback/data-access/playback-repo";
import { makePOST } from "@/lib/route-factory";

export const POST = makePOST({
  auth: "required",
  body: PreviousPlaybackInputSchema,
  handler: async ({ userId, body }) => {
    return skipToPrevious(userId!, body.positionMs);
  },
});
