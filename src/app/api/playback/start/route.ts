import { StartPlaybackInputSchema } from "@/features/playback/contracts/playback-dto";
import { startPlaybackSession } from "@/features/playback/data-access/playback-repos";
import { makePOST } from "@/lib/route-factory";

export const POST = makePOST({
  auth: "required",
  body: StartPlaybackInputSchema,
  handler: async ({ body, userId }) => {
    return startPlaybackSession({ input: body, userId: userId! });
  },
});
