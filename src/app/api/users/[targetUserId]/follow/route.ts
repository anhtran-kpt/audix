import { getFollowStatus } from "@/features/user/data-access/user-repo";
import { UserParamsSchema } from "@/features/user/data-access/user-schema";
import { makeGET } from "@/lib/route-factory";

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
