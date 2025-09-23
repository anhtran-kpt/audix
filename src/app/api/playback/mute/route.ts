import { MutePlaybackInputSchema } from "@/features/playback/contracts/playback-dto";
import { mutePlayback } from "@/features/playback/data-access/playback-repos";
import { makePATCH } from "@/lib/route-factory";

export const PATCH = makePATCH({
  auth: "required",
  body: MutePlaybackInputSchema,
  handler: async ({ userId, body }) => {
    return mutePlayback(userId!, body);
  },
});
