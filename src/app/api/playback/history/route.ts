import { RecordPlayInputSchema } from "@/contracts/playback";
import { makePOST } from "@/lib/route-factory";
import { recordPlay } from "@/server/modules/playback/services";

export const POST = makePOST({
  auth: "public",
  body: RecordPlayInputSchema,
  handler: async ({ body }) => {
    return await recordPlay(body);
  },
});
