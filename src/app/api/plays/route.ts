import { makePOST } from "@/server/handlers/route-factory";
import { recordPlay } from "@/server/services/play.service";
import { recordPlaySchema } from "@/server/contracts/play.contract";

export const POST = makePOST({
  auth: "required",
  body: recordPlaySchema,
  handler: async ({ userId, body }) => {
    await recordPlay({
      userId: userId!,
      trackId: body.trackId,
      listenedSec: body.listenedSec,
      playedAt: body.playedAt ?? new Date(body.playedAt),
      sourceType: body.sourceType,
      sourceId: body.sourceId ?? undefined,
    });
    return { ok: true };
  },
});
