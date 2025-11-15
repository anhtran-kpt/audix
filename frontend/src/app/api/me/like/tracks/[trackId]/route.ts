import { toggleLikeTrack } from "@/features/me/me-actions";
import { TrackParamsSchema } from "@/features/track/track-schemas";
import { makePUT } from "@/lib/route-factory";

export const PUT = makePUT({
  auth: "required",
  params: TrackParamsSchema,
  handler: async ({ params }) => {
    return toggleLikeTrack(params.trackId);
  },
});
