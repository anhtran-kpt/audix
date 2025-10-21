import { CreatePlaylistInputSchema } from "@/features/playlist/contracts/playlist-schema";
import { createPlaylist } from "@/features/playlist/data-access/playlist-repo";
import { makePOST } from "@/lib/route-factory";

export const POST = makePOST({
  auth: "required",
  body: CreatePlaylistInputSchema,
  handler: async ({ userId, body }) => {
    return createPlaylist(userId!, body);
  },
});
