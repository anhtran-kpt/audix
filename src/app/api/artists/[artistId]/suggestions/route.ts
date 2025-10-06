import { ArtistParamsSchema } from "@/features/artist/contracts/artist-schema";
import { getArtistPopularTracks } from "@/features/artist/data-access/artist-repo";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  params: ArtistParamsSchema,
  handler: async ({ params }) => {
    return getArtistPopularTracks(params.artistId);
  },
});
