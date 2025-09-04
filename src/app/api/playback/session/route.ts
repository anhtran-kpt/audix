import { PlaybackSessionInputSchema } from "@/features/playback/contracts/playback-dto";
import { updateSession } from "@/features/playback/data-access/playback-repos";
import { makePUT } from "@/lib/route-factory";

export const PUT = makePUT({
  auth: "public",
  body: PlaybackSessionInputSchema,
  handler: async ({ body }) => {
    return await updateSession(body);
  },
});
