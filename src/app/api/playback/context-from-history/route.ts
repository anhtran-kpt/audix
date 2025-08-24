import { zCuid } from "@/contracts/common";
import { makePOST } from "@/server/api/route-factory";
import { getContextFromHistory } from "@/server/modules/playback/services";

export const POST = makePOST({
  auth: "public",
  handler: async ({ req }) => {
    const url = new URL(req.url);
    const trackId = zCuid.parse(url.searchParams.get("trackId"));
    return await getContextFromHistory(trackId);
  },
});
