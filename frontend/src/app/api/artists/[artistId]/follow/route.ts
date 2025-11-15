import { getArtistFollowersCount } from "@/features/artist/artist-data";
import { makeGET } from "@/lib/route-factory";
import z, { object } from "zod";

const FollowParamsSchema = object({ artistId: z.cuid2() });

export const GET = makeGET({
  auth: "required",
  params: FollowParamsSchema,
  handler: async ({ userId, params }) => {
    return await getArtistFollowersCount(userId!, params.artistId);
  },
});
