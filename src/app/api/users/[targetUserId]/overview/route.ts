import { UserParamsSchema } from "@/features/user/contracts/user-schema";
import { getUserOverview } from "@/lib/data/user-data";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  params: UserParamsSchema,
  handler: async ({ params }) => {
    return getUserOverview(params.targetUserId);
  },
});
