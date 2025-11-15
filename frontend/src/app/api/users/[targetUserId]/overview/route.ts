import { UserParamsSchema } from "@/features/user/user-schemas";
import { getUserOverview } from "@/features/user/user-data";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  params: UserParamsSchema,
  handler: async ({ params }) => {
    return getUserOverview(params.targetUserId);
  },
});
