import { getContextFromHistory } from "@/features/playback/data-access/playback-repos";
import { zCuidSchema } from "@/features/shared/contracts/shared-dto";
import { makePOST } from "@/lib/route-factory";

export const POST = makePOST({
  auth: "public",
  handler: async ({ req }) => {
    const url = new URL(req.url);
    const trackId = zCuidSchema.parse(url.searchParams.get("trackId"));
    return await getContextFromHistory(trackId);
  },
});
