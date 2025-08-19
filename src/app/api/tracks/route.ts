import { defineRoute } from "@/lib/route";
import { listTracksByIdsService } from "@/modules/tracks/service";
import { ok } from "@/lib/http";
import { cuid2, object } from "zod";

export const POST = defineRoute({
  body: object({ trackIds: cuid2().array() }),
  handler: async ({ body }) => {
    console.log("body", body);
    return ok(await listTracksByIdsService(body.trackIds));
  },
});
