import { toggleLikeTrack } from "@/features/me/data-access/me-repo";
import { TrackParamsSchema } from "@/features/track/contracts/track-schema";
import { makePUT } from "@/lib/route-factory";

export const PUT = makePUT({
  auth: "required",
  params: TrackParamsSchema,
  handler: async ({ userId, params }) => {
    return toggleLikeTrack({ userId: userId!, trackId: params.trackId });
  },
});
