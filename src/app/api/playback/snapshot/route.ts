import { SnapshotInputSchema } from "@/contracts/playback";
import { makePOST } from "@/server/api/route-factory";
import { snapshot } from "@/server/modules/playback/services";

export const POST = makePOST({
  auth: "required",
  body: SnapshotInputSchema,
  handler: async ({ userId, body }) => {
    return await snapshot(userId!, body);
  },
});
