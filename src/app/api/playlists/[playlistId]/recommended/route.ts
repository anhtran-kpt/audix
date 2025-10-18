import { getRecommendedTracks } from "@/features/playlist/data-access/playlist-repo";
import { makeGET } from "@/lib/route-factory";
import z, { object } from "zod";

export const GET = makeGET({
  auth: "required",
  params: object({ playlistId: z.cuid2() }),
  handler: async ({ params, req, userId }) => {
    const searchParams = req.nextUrl.searchParams;
    const take = searchParams.get("take") ?? "5";
    return getRecommendedTracks({
      userId: userId!,
      playlistId: params.playlistId,
      take: parseInt(take),
    });
  },
});
