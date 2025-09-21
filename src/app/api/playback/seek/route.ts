import { SeekPlaybackInputSchema } from "@/features/playback/contracts/playback-dto";
import { seekPlayback } from "@/features/playback/data-access/playback-repos";
import { makePOST } from "@/lib/route-factory";

export const POST = makePOST({
  auth: "required",
  body: SeekPlaybackInputSchema,
  handler: async ({ userId, body }) => {
    return seekPlayback(userId!, body.positionMs);
  },
});
