import { ok } from "@/lib/http";
import { defineRoute } from "@/lib/route";
import { listRecentTracks } from "@/modules/tracks/services";
import { getUserIdOrThrow } from "@/server/auth";

export const GET = defineRoute({
  handler: async () => {
    const userId = await getUserIdOrThrow();
    return ok(await listRecentTracks(userId));
  },
});
