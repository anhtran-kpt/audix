import { CreatePlaylistInputSchema } from "@/contracts/playlist";
import { makePOST } from "@/server/api/route-factory";
import { createPlaylist } from "@/server/modules/playlist/services";

export const POST = makePOST({
  auth: "required",
  body: CreatePlaylistInputSchema,
  handler: async ({ userId, body }) => {
    return createPlaylist(userId!, body);
  },
});
