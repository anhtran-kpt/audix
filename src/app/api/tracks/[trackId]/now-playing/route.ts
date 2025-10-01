import { zCuidSchema } from "@/features/shared/contracts/shared-dto";
import { getNowPlayingTrack } from "@/features/track/data-access/track-repo";
import { makeGET } from "@/lib/route-factory";
import { object } from "zod";

export const GET = makeGET({
  auth: "public",
  params: object({ trackId: zCuidSchema }),
  async handler({ params }) {
    return getNowPlayingTrack(params.trackId);
  },
});
