import { PreviousPlaybackInputSchema } from "@/features/playback/contracts/playback-dto";
import { skipToPrevious } from "@/features/playback/data-access/playback-repos";
import { makePOST } from "@/lib/route-factory";

export const POST = makePOST({
  auth: "required",
  body: PreviousPlaybackInputSchema,
  handler: async ({ userId, body }) => {
    return skipToPrevious(userId!, body.positionMs);
  },
});
