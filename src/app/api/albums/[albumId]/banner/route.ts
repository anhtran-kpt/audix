import { AlbumParamsSchema } from "@/features/album/contracts/album-schema";
import { getAlbumBanner } from "@/features/album/data-access/album-repo";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  params: AlbumParamsSchema,
  handler: async ({ params }) => {
    return getAlbumBanner(params.albumId);
  },
});
