import { mergeGuestSession } from "@/features/playback/data-access/playback-repo";
import { makePOST } from "@/lib/route-factory";

export const POST = makePOST({
  auth: "required",
  handler: async ({ userId }) => {
    return await mergeGuestSession(userId!);
  },
});
