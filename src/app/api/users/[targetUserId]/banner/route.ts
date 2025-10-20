import { getUserBanner } from "@/features/user/data-access/user-repo";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  handler: async ({ userId }) => {
    return getUserBanner(userId!);
  },
});
