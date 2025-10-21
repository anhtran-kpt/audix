import { UserParamsSchema } from "@/features/user/contracts/user-schema";
import { getUserBanner } from "@/features/user/data-access/user-repo";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  params: UserParamsSchema,
  handler: async ({ params }) => {
    return getUserBanner(params.targetUserId);
  },
});
