import { CreatePlaylistInputSchema } from "@/features/playlist/contracts/playlist-dto";
import {
  createPlaylist,
  getUserPlaylistsWithoutTrack,
} from "@/features/playlist/data-access/playlist-repos";
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
  handler: async ({ userId, req }) => {
    const excludeTrackId = req.nextUrl.searchParams.get("excludeTrackId");
    return getUserPlaylistsWithoutTrack(userId!, excludeTrackId!);
  },
});
