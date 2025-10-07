import { AlbumParamsSchema } from "@/features/album/contracts/album-schema";
import { getAlbumSuggestions } from "@/features/album/data-access/album-repo";
import { PaginationParamsSchema } from "@/features/shared/contracts/shared-schema";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  params: AlbumParamsSchema,
  query: PaginationParamsSchema,
  handler: async ({ params, query }) => {
    return getAlbumSuggestions(params.albumId, query);
  },
});
