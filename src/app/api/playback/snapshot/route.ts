import { SnapshotInputSchema } from "@/contracts/playback";
import { makePOST } from "@/lib/route-factory";
import { snapshot } from "@/server/modules/playback/services";

export const POST = makePOST({
  auth: "public",
  body: SnapshotInputSchema,
  handler: async ({ body }) => {
    return await snapshot(body);
  },
});
