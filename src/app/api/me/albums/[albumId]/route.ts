import { ToggleLikeAlbumInputSchema } from "@/features/me/contracts/me-schema";
import { likeAlbum, unlikeAlbum } from "@/features/me/data-access/me-repo";
import { makeDELETE, makePUT } from "@/lib/route-factory";

export const PUT = makePUT({
  auth: "required",
  params: ToggleLikeAlbumInputSchema,
  handler: async ({ userId, params }) => {
    return likeAlbum({ userId: userId!, albumId: params.albumId });
  },
});

export const DELETE = makeDELETE({
  auth: "required",
  params: ToggleLikeAlbumInputSchema,
  handler: async ({ userId, params }) => {
    return unlikeAlbum({ userId: userId!, albumId: params.albumId });
  },
});
