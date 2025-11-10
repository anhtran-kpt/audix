import { skipToNext } from "@/features/playback/playback-actions";
import { makePOST } from "@/lib/route-factory";

export const POST = makePOST({
  auth: "required",
  handler: async ({ userId }) => {
    return skipToNext(userId!);
  },
});
