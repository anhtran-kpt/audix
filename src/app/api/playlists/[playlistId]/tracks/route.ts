import { AddTrackToPlaylistInputSchema } from "@/features/playlist/contracts/playlist-schema";
import { addTrackToPlaylist } from "@/features/playlist/data-access/playlist-repo";
import { makePOST } from "@/lib/route-factory";
import z, { object } from "zod";

export const POST = makePOST({
  auth: "required",
  params: object({ playlistId: z.cuid2() }),
  body: AddTrackToPlaylistInputSchema,
  handler: async ({ body, params }) => {
    return addTrackToPlaylist(params.playlistId, body.trackId);
  },
});
