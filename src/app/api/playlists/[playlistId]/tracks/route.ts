import {
  AddTrackToPlaylistInputSchema,
  PlaylistParamsSchema,
} from "@/features/playlist/playlist-schemas";
import { addTrackToPlaylist } from "@/features/playlist/playlist-actions";
import { getPlaylistTracks } from "@/features/playlist/playlist-data";
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
