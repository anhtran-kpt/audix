import { UserParamsSchema } from "@/features/user/contracts/user-schema";
import { makeGET } from "@/lib/route-factory";
import { PaginationParamsSchema } from "@/features/shared/contracts/shared-schema";
import { getUserFollowedArtists } from "@/lib/data/user-data";

export const GET = makeGET({
  auth: "required",
  params: UserParamsSchema,
  query: PaginationParamsSchema,
  handler: async ({ params, query }) => {
    return await getUserFollowedArtists({
      targetUserId: params.targetUserId,
      params: query,
    });
  },
});
