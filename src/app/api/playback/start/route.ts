import { StartInputSchema } from "@/features/play/contracts/play-dtos";
import { startPlaybackSession } from "@/features/playback/data-access/playback-repos";
import { makePOST } from "@/lib/route-factory";

export const POST = makePOST({
  auth: "required",
  body: StartInputSchema,
  handler: async ({ body, userId }) => {
    return startPlaybackSession({ input: body, userId: userId! });
  },
});
