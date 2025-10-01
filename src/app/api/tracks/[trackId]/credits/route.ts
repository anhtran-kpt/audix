import { zCuidSchema } from "@/features/shared/contracts/shared-dto";
import { getCredits } from "@/features/track/data-access/track-repo";
import { makeGET } from "@/lib/route-factory";
import { object } from "zod";

export const GET = makeGET({
  auth: "public",
  params: object({ trackId: zCuidSchema }),
  handler: async ({ params }) => {
    return getCredits(params.trackId);
  },
});
