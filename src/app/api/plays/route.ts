import { RecordPlayInputSchema } from "@/contracts/track";
import { makePOST } from "@/server/api/route-factory";
import { recordPlay } from "@/server/modules/track/services";

export const POST = makePOST({
  auth: "required",
  body: RecordPlayInputSchema,
  handler: async ({ body }) => {
    recordPlay(body);
  },
});
