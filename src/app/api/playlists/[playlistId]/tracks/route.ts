import {
  AddTrackToPlaylistInputSchema,
  PlaylistParamsSchema,
} from "@/features/playlist/contracts/playlist-schema";
import { addTrackToPlaylist } from "@/features/playlist/data-access/playlist-repo";
import { getPlaylistTracks } from "@/lib/data/playlist-data";
import { makeGET, makePOST } from "@/lib/route-factory";

export const POST = makePOST({
  auth: "required",
  params: PlaylistParamsSchema,
  body: AddTrackToPlaylistInputSchema,
  handler: async ({ body, params }) => {
    return addTrackToPlaylist(params.playlistId, body.trackId);
  },
});

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
