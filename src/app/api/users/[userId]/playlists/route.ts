import { getUserPlaylistsWithoutTrack } from "@/features/playlist/data-access/playlist-repos";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  handler: async ({ userId, req }) => {
    const excludeTrackId = req.nextUrl.searchParams.get("excludeTrackId");
    return getUserPlaylistsWithoutTrack(userId!, excludeTrackId!);
  },
});
