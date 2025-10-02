import { getTrackCredits } from "@/features/track/data-access/track-repo";
import { makeGET } from "@/lib/route-factory";
import z, { object } from "zod";

export const GET = makeGET({
  auth: "public",
  params: object({ trackId: z.cuid2() }),
  handler: async ({ params }) => {
    return getTrackCredits(params.trackId);
  },
});
