import { AddTrackToPlaylistInputSchema } from "@/features/playlist/contracts/playlist-dto";
import {
  addTrackToPlaylist,
  removeTrackFromPlaylist,
} from "@/features/playlist/data-access/playlist-repos";
import { zCuidSchema } from "@/features/shared/contracts/shared-dto";
import { makeDELETE, makePOST } from "@/lib/route-factory";
import { object } from "zod";

export const POST = makePOST({
  auth: "required",
  params: object({ playlistId: zCuidSchema }),
  body: AddTrackToPlaylistInputSchema,
  handler: async ({ body, params }) => {
    return addTrackToPlaylist(params.playlistId, body.trackId);
  },
});

export const DELETE = makeDELETE({
  auth: "required",
  params: object({ playlistId: zCuidSchema, trackId: zCuidSchema }),
  handler: async ({ params }) => {
    return removeTrackFromPlaylist(params);
  },
});
