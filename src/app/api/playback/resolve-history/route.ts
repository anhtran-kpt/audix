import { ResolveHistoryInputSchema } from "@/contracts/playback";
import { makePOST } from "@/server/api/route-factory";
import { resolveHistory } from "@/server/modules/playback/services";

export const POST = makePOST({
  auth: "required",
  body: ResolveHistoryInputSchema,
  handler: async ({ body }) => {
    return await resolveHistory(body);
  },
});
