import { zCuid } from "@/contracts/common";
import { makeDELETE, makeGET, makePOST } from "@/lib/route-factory";
import {
  followArtist,
  getFollowStatus,
  unfollowArtist,
} from "@/server/modules/artist/services";
import { object } from "zod";

const FollowParamsSchema = object({ artistId: zCuid });

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
