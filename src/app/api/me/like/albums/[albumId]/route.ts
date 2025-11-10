import { ToggleLikeAlbumInputSchema } from "@/features/me/me-schemas";
import { getLikedAlbumStatus } from "@/features/me/me-data";
import { makeDELETE, makeGET, makePUT } from "@/lib/route-factory";
import { likeAlbum, unlikeAlbum } from "@/features/me/me-actions";

export const GET = makeGET({
  auth: "required",
  params: ToggleLikeAlbumInputSchema,
  handler: async ({ userId, params }) => {
    return getLikedAlbumStatus({ userId: userId!, albumId: params.albumId });
  },
});

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
