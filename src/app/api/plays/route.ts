import { makePOST } from "@/server/api/route-factory";
import { RecordPlaySchema } from "@/server/modules/track/contracts";
import { recordPlay } from "@/server/modules/track/services";

export const POST = makePOST({
  auth: "required",
  body: RecordPlaySchema,
  handler: async ({ body }) => {
    recordPlay(body);
  },
});
