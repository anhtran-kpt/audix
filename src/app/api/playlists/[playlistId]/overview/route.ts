import { PlaylistParamsSchema } from "@/features/playlist/playlist-schemas";
import { makeGET } from "@/lib/route-factory";
import { getPlaylistOverview } from "@/features/playlist/playlist-data";

export const GET = makeGET({
  auth: "required",
  params: PlaylistParamsSchema,
  handler: async ({ userId, params }) => {
    return getPlaylistOverview({
      userId: userId!,
      playlistId: params.playlistId,
    });
  },
});
