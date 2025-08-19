import { defineRoute } from "@/lib/route";
import { ok, notFound as jsonNotFound } from "@/lib/http";
import { baseFields } from "@/modules/shared/schemas";
import { object } from "zod";
import { findTrackById } from "@/modules/tracks/services";

export const GET = defineRoute({
  params: object({ trackId: baseFields.id }),
  handler: async ({ params }) => {
    const track = await findTrackById(params.trackId);
    if (!track) return jsonNotFound("Track not found");
    return ok(track);
  },
});
