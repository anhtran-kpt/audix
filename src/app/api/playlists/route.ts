import { CreatePlaylistInputSchema } from "@/features/playlist/contracts/playlist-dto";
import { createPlaylist } from "@/features/playlist/data-access/playlist-repos";
import { makePOST } from "@/lib/route-factory";

export const POST = makePOST({
  auth: "required",
  body: CreatePlaylistInputSchema,
  handler: async ({ userId, body }) => {
    return createPlaylist(userId!, body);
  },
});
