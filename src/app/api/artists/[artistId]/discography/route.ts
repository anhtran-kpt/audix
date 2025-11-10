import { ArtistParamsSchema } from "@/features/artist/artist-schemas";
import { PaginationParamsSchema } from "@/features/shared/shared-schemas";
import { getArtistDiscography } from "@/features/artist/artist-data";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  params: ArtistParamsSchema,
  query: PaginationParamsSchema,
  handler: async ({ params, query }) => {
    return getArtistDiscography(params.artistId, query);
  },
});
