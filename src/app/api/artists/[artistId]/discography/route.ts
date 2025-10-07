import { ArtistParamsSchema } from "@/features/artist/contracts/artist-schema";
import { getArtistDiscography } from "@/features/artist/data-access/artist-repo";
import { PaginationParamsSchema } from "@/features/shared/contracts/shared-schema";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  params: ArtistParamsSchema,
  query: PaginationParamsSchema,
  handler: async ({ params, query }) => {
    return getArtistDiscography(params.artistId, query);
  },
});
