import { getTrackOrThrow } from "@/features/track/data-access/track-repos";
import { makeGET } from "@/lib/route-factory";
import { cuid2, object } from "zod";

export const GET = makeGET({
  auth: "public",
  params: object({ trackId: cuid2() }),
  async handler({ params }) {
    return getTrackOrThrow(params.trackId);
  },
});
