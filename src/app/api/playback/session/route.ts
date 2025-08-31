import { PlaybackSessionInputSchema } from "@/contracts/playback";
import { makePUT } from "@/lib/route-factory";
import { updateSession } from "@/server/modules/playback/services";

export const PUT = makePUT({
  auth: "public",
  body: PlaybackSessionInputSchema,
  handler: async ({ body }) => {
    return await updateSession(body);
  },
});
