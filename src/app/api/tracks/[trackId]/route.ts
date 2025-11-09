import { getFullTrackById } from "@/lib/data/track-data";
import { makeGET } from "@/lib/route-factory";
import { cuid2, object } from "zod";

export const GET = makeGET({
  auth: "public",
  params: object({ trackId: cuid2() }),
  async handler({ params }) {
    return getFullTrackById(params.trackId);
  },
});
