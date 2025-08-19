import { defineRoute } from "@/lib/route";
import { findTrackByIdService } from "@/modules/tracks/service";
import { ok, notFound as jsonNotFound } from "@/lib/http";
import { baseFields } from "@/modules/shared/schemas";
import { object } from "zod";

export const GET = defineRoute({
  params: object({ trackId: baseFields.id }),
  handler: async ({ params }) => {
    const track = await findTrackByIdService(params.trackId);
    if (!track) return jsonNotFound("Track not found");
    return ok(track);
  },
});
