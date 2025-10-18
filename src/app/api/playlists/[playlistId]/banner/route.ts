import { PlaylistParamsSchema } from "@/features/playlist/contracts/playlist-schema";
import { getPlaylistBanner } from "@/features/playlist/data-access/playlist-repo";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  params: PlaylistParamsSchema,
  handler: async ({ userId, params }) => {
    return getPlaylistBanner({
      userId: userId!,
      playlistId: params.playlistId,
    });
  },
});
