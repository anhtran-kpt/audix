import { ok } from "@/lib/http";
import { defineRoute } from "@/lib/route";

export const POST = defineRoute({
  handler: async ({ userId, body }) => {
    await recordPlay({
      userId: userId!,
      trackId: body.trackId,
      listenedSec: body.listenedSec,
      playedAt: body.playedAt ?? new Date(body.playedAt),
      sourceType: body.sourceType,
      sourceId: body.sourceId ?? undefined,
    });
    return ok();
  },
});
