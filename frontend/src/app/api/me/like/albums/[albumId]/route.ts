import { ToggleLikeAlbumInputSchema } from "@/features/me/me-schemas";
import { getLikedAlbumStatus } from "@/features/me/me-data";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  params: ToggleLikeAlbumInputSchema,
  handler: async ({ userId, params }) => {
    return getLikedAlbumStatus({ userId: userId!, albumId: params.albumId });
  },
});
