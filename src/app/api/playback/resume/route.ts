import { resumePlayback } from "@/features/playback/data-access/playback-repos";
import { makePOST } from "@/lib/route-factory";

export const POST = makePOST({
  auth: "required",
  handler: async ({ userId }) => {
    return resumePlayback(userId!);
  },
});
