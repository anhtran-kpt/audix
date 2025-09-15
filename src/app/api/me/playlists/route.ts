import { getUserPlaylists } from "@/features/playlist/data-access/playlist-repos";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  handler: async ({ userId, req }) => {
    const trackId = req.nextUrl.searchParams.get("trackId");
    return getUserPlaylists(userId!, trackId!);
  },
});
