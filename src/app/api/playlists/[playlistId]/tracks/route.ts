import { AddTrackToPlaylistInputSchema } from "@/features/playlist/contracts/playlist-dto";
import {
  addTrackToPlaylist,
  getPlaylistTracks,
} from "@/features/playlist/data-access/playlist-repos";
import { zCuidSchema } from "@/features/shared/contracts/shared-dto";
import { makeGET, makePOST } from "@/lib/route-factory";
import { object } from "zod";

export const POST = makePOST({
  auth: "required",
  params: object({ playlistId: zCuidSchema }),
  body: AddTrackToPlaylistInputSchema,
  handler: async ({ body, params }) => {
    addTrackToPlaylist(params.playlistId, body.trackId, body.position);
  },
});

export const GET = makeGET({
  auth: "public",
  params: object({ playlistId: zCuidSchema }),
  handler: async ({ params }) => {
    getPlaylistTracks(params.playlistId);
  },
});
