import { makePOST } from "@/lib/route-factory";
import { getTrackListByIds } from "@/server/modules/track/services";
import { cuid2, object } from "zod";

export const POST = makePOST({
  body: object({ trackIds: cuid2().array() }),
  handler: async ({ body }) => {
    return getTrackListByIds(body.trackIds);
  },
});
