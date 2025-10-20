import { GetTracksQuerySchema } from "@/features/track/contracts/track-schema";
import { getTrackListByIds } from "@/features/track/data-access/track-repo";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  query: GetTracksQuerySchema,
  handler: async ({ query }) => {
    return getTrackListByIds(query.ids);
  },
});
