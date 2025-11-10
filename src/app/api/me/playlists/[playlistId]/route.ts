import { likePlaylist, unlikePlaylist } from "@/features/me/me-actions";
import { ToggleLikePlaylistInputSchema } from "@/features/me/me-schemas";
import { makeDELETE, makePUT } from "@/lib/route-factory";

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
