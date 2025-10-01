import { getTrackListByIds } from "@/features/track/data-access/track-repo";
import { makePOST } from "@/lib/route-factory";
import { cuid2, object } from "zod";

export const POST = makePOST({
  body: object({ trackIds: cuid2().array() }),
  handler: async ({ body }) => {
    return getTrackListByIds(body.trackIds);
  },
});
