import { followArtist, unfollowArtist } from "@/features/artist/artist-actions";
import { getArtistFollowersCount } from "@/features/artist/artist-data";
import { makeDELETE, makeGET, makePOST } from "@/lib/route-factory";
import z, { object } from "zod";

const FollowParamsSchema = object({ artistId: z.cuid2() });

export const GET = makeGET({
  auth: "required",
  params: FollowParamsSchema,
  handler: async ({ userId, params }) => {
    return await getArtistFollowersCount(userId!, params.artistId);
  },
});

export const POST = makePOST({
  auth: "required",
  params: FollowParamsSchema,
  handler: async ({ userId, params }) => {
    return await followArtist(userId!, params.artistId);
  },
});

export const DELETE = makeDELETE({
  auth: "required",
  params: FollowParamsSchema,
  handler: async ({ userId, params }) => {
    return await unfollowArtist(userId!, params.artistId);
  },
});
