import { getRecommendedTracks } from "@/features/playlist/data-access/playlist-repos";
import { zCuidSchema } from "@/features/shared/contracts/shared-dto";
import { makeGET } from "@/lib/route-factory";
import { object } from "zod";

export const GET = makeGET({
  auth: "required",
  params: object({ playlistId: zCuidSchema }),
  handler: async ({ params, req }) => {
    const searchParams = req.nextUrl.searchParams;
    const take = searchParams.get("take") ?? "5";
    return getRecommendedTracks(params.playlistId, parseInt(take));
  },
});
