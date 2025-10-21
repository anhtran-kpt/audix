import { getMyFollowers } from "@/features/me/data-access/me-repo";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  handler: async ({ userId }) => {
    return await getMyFollowers(userId!);
  },
});
