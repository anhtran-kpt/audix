import { makePOST } from "@/lib/route-factory";
import { mergeGuestSession } from "@/server/modules/playback/services";

export const POST = makePOST({
  auth: "required",
  handler: async ({ userId }) => {
    return await mergeGuestSession(userId!);
  },
});
