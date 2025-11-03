import { ArtistParamsSchema } from "@/features/artist/contracts/artist-schema";
import { PaginationParamsSchema } from "@/features/shared/contracts/shared-schema";
import { getRelatedArtists } from "@/lib/data/artist-data";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  params: ArtistParamsSchema,
  query: PaginationParamsSchema,
  handler: async ({ params, query }) => {
    return getRelatedArtists(params.artistId, query);
  },
});
