import { getContextFromHistory } from "@/features/playback/data-access/playback-repos";
import { zCuidSchema } from "@/features/shared/contracts/shared-dto";
import { makePOST } from "@/lib/route-factory";
import { object } from "zod";

export const POST = makePOST({
  auth: "public",
  body: object({ trackId: zCuidSchema }),
  handler: async ({ body }) => {
    return await getContextFromHistory(body.trackId);
  },
});
