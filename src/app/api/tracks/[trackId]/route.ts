import { makeGET } from "@/server/api/route-factory";
import { getTrackOrThrow } from "@/server/modules/track/services";
import { cuid2, object } from "zod";

export const GET = makeGET({
  auth: "public",
  params: object({ trackId: cuid2() }),
  async handler({ params }) {
    return getTrackOrThrow(params!.trackId);
  },
});
