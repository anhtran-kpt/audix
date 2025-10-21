import {
  followUser,
  getFollowStatus,
  unfollowUser,
} from "@/features/user/data-access/user-repo";
import { UserParamsSchema } from "@/features/user/contracts/user-schema";
import { makeDELETE, makeGET, makePOST } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  params: UserParamsSchema,
  handler: async ({ params, userId }) => {
    return getFollowStatus({
      userId: userId!,
      targetUserId: params.targetUserId,
    });
  },
});

export const POST = makePOST({
  auth: "required",
  params: UserParamsSchema,
  handler: async ({ userId, params }) => {
    return await followUser({
      userId: userId!,
      targetUserId: params.targetUserId,
    });
  },
});

export const DELETE = makeDELETE({
  auth: "required",
  params: UserParamsSchema,
  handler: async ({ userId, params }) => {
    return await unfollowUser({
      userId: userId!,
      targetUserId: params.targetUserId,
    });
  },
});
