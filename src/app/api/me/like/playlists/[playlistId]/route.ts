import { ToggleLikePlaylistInputSchema } from "@/features/me/contracts/me-schema";
import {
  likePlaylist,
  unlikePlaylist,
} from "@/features/me/data-access/me-repo";
import { getLikedPlaylistStatus } from "@/lib/data/me-data";
import { makeDELETE, makeGET, makePUT } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  params: ToggleLikePlaylistInputSchema,
  handler: async ({ userId, params }) => {
    return getLikedPlaylistStatus({
      userId: userId!,
      playlistId: params.playlistId,
    });
  },
});

export const PUT = makePUT({
  auth: "required",
  params: ToggleLikePlaylistInputSchema,
  handler: async ({ userId, params }) => {
    return likePlaylist({ userId: userId!, playlistId: params.playlistId });
  },
});

export const DELETE = makeDELETE({
  auth: "required",
  params: ToggleLikePlaylistInputSchema,
  handler: async ({ userId, params }) => {
    return unlikePlaylist({ userId: userId!, playlistId: params.playlistId });
  },
});
