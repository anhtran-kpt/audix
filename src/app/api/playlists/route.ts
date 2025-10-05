import { getMyPlaylists } from "@/features/me/data-access/me-repo";
import { CreatePlaylistInputSchema } from "@/features/playlist/contracts/playlist-schema";
import { createPlaylist } from "@/features/playlist/data-access/playlist-repo";
import { makeGET, makePOST } from "@/lib/route-factory";

export const POST = makePOST({
  auth: "required",
  body: CreatePlaylistInputSchema,
  handler: async ({ userId, body }) => {
    return createPlaylist(userId!, body);
  },
});

export const GET = makeGET({
  auth: "required",
  handler: async ({ userId }) => {
    return getMyPlaylists(userId!);
  },
});
