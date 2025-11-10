import { ToggleLikePlaylistInputSchema } from "@/features/me/me-schemas";
import { getLikedPlaylistStatus } from "@/features/me/me-data";
import { makeDELETE, makeGET, makePUT } from "@/lib/route-factory";
import { likePlaylist, unlikePlaylist } from "@/features/me/me-actions";

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
