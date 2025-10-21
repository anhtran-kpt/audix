import { getUserFollowers } from "@/features/user/data-access/user-repo";
import { UserParamsSchema } from "@/features/user/contracts/user-schema";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  params: UserParamsSchema,
  handler: async ({ params }) => {
    return await getUserFollowers(params.targetUserId);
  },
});
