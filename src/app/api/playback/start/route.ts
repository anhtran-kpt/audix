import { StartPlaybackInputSchema } from "@/features/playback/playback-schemas";
import { startPlaybackSession } from "@/features/playback/playback-actions";
import { makePOST } from "@/lib/route-factory";

export const POST = makePOST({
  auth: "required",
  body: StartPlaybackInputSchema,
  handler: async ({ body, userId }) => {
    return startPlaybackSession({ context: body, userId: userId! });
  },
});
