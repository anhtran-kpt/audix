import { PlaylistParamsSchema } from "@/features/playlist/playlist-schemas";
import { getPlaylistTracks } from "@/features/playlist/playlist-data";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  params: PlaylistParamsSchema,
  handler: async ({ params, userId }) => {
    return getPlaylistTracks({
      userId: userId!,
      playlistId: params.playlistId,
    });
  },
});
