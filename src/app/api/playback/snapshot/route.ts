import { SnapshotInputSchema } from "@/features/playback/contracts/playback-dto";
import { snapshot } from "@/features/playback/data-access/playback-repo";
import { makePOST } from "@/lib/route-factory";

export const POST = makePOST({
  auth: "public",
  body: SnapshotInputSchema,
  handler: async ({ body }) => {
    return await snapshot(body);
  },
});
