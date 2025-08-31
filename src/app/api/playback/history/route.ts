import { RecordPlayInputSchema } from "@/features/playback/contracts/playback-dto";
import { recordPlay } from "@/features/playback/data-access/playback-repo";
import { makePOST } from "@/lib/route-factory";

export const POST = makePOST({
  auth: "public",
  body: RecordPlayInputSchema,
  handler: async ({ body }) => {
    return await recordPlay(body);
  },
});
