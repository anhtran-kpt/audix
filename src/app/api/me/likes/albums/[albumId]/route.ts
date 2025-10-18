import { ToggleLikeAlbumInputSchema } from "@/features/me/contracts/me-schema";
import {
  getLikedAlbumStatus,
  likeAlbum,
  unlikeAlbum,
} from "@/features/me/data-access/me-repo";
import { makeDELETE, makeGET, makePUT } from "@/lib/route-factory";

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
