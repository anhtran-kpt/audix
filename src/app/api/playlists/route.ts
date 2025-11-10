import { CreatePlaylistInputSchema } from "@/features/playlist/playlist-schemas";
import { createPlaylist } from "@/features/playlist/playlist-actions";
import { makePOST } from "@/lib/route-factory";

export const POST = makePOST({
  auth: "required",
  body: CreatePlaylistInputSchema,
  handler: async ({ userId, body }) => {
    return createPlaylist(userId!, body);
  },
});
