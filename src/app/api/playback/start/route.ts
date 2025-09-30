import { StartPlaybackInputSchema } from "@/features/playback/contracts/playback-schema";
import { startPlaybackSession } from "@/features/playback/data-access/playback-repo";
import { makePOST } from "@/lib/route-factory";

export const POST = makePOST({
  auth: "required",
  body: StartPlaybackInputSchema,
  handler: async ({ body, userId }) => {
    return startPlaybackSession({ context: body, userId: userId! });
  },
});
