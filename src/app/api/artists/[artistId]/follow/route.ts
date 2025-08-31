import {
  followArtist,
  getFollowStatus,
  unfollowArtist,
} from "@/features/artist/data-access/artist-repo";
import { zCuidSchema } from "@/features/shared/contracts/shared-dto";
import { makeDELETE, makeGET, makePOST } from "@/lib/route-factory";
import { object } from "zod";

const FollowParamsSchema = object({ artistId: zCuidSchema });

export const GET = makeGET({
  auth: "required",
  params: FollowParamsSchema,
  handler: async ({ userId, params }) => {
    return await getFollowStatus(userId!, params.artistId);
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
