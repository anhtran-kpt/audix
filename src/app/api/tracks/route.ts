import { defineRoute } from "@/lib/route";
import { ok } from "@/lib/http";
import { cuid2, object } from "zod";
import { listTracksByIds } from "@/modules/tracks/services";

export const POST = defineRoute({
  body: object({ trackIds: cuid2().array() }),
  handler: async ({ body }) => {
    console.log("body", body);
    return ok(await listTracksByIds(body.trackIds));
  },
});
