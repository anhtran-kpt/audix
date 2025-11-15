import { GetTracksQuerySchema } from "@/features/track/track-schemas";
import { getTrackListByIds } from "@/features/track/track-actions";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  query: GetTracksQuerySchema,
  handler: async ({ query }) => {
    return getTrackListByIds(query.ids);
  },
});
