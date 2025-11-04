import { PaginationParamsSchema } from "@/features/shared/contracts/shared-schema";
import { getMyFollowers } from "@/lib/data/me-data";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  query: PaginationParamsSchema,
  handler: async ({ userId, query }) => {
    return await getMyFollowers({ userId: userId!, params: query });
  },
});
