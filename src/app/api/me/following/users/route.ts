import { PaginationParamsSchema } from "@/features/shared/contracts/shared-schema";
import { getMyFollowedUsers } from "@/lib/data/me-data";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  query: PaginationParamsSchema,
  handler: async ({ userId, query }) => {
    return getMyFollowedUsers({ userId: userId!, params: query });
  },
});
